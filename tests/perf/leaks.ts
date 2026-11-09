import type { CDPSession, Page } from "@playwright/test"
import { waitFrames } from "./init"

// What the leak specs compare before and after: listeners on the window and
// the document, animation frames not yet run, open popup layers, detached
// elements with a `data-slot`, and the heap after garbage collection.
type LeakSnapshot = Awaited<ReturnType<typeof snapshot>>

// Keeps the animation frames requested and not yet run or canceled. Runs in
// the page before any fixture code, so it must not close over anything.
function trackFrames() {
  const pending = new Set<number>()
  const request = window.requestAnimationFrame.bind(window)
  const cancel = window.cancelAnimationFrame.bind(window)
  window.requestAnimationFrame = (callback) => {
    const id = request((time) => {
      pending.delete(id)
      callback(time)
    })
    pending.add(id)
    return id
  }
  window.cancelAnimationFrame = (id) => {
    pending.delete(id)
    cancel(id)
  }
  Object.assign(window, { __pendingFrames: pending })
}

/** Tracks pending animation frames on every page the test opens. Call before `open()`. */
async function countFrames(page: Page) {
  await page.addInitScript(trackFrames)
}

// Listeners on an object the page evaluates, like `window`, by event type.
async function listenersOn(
  cdp: CDPSession,
  expression: string,
  objectGroup: string
) {
  const { result } = await cdp.send("Runtime.evaluate", {
    expression,
    objectGroup,
  })
  const { listeners } = await cdp.send("DOMDebugger.getEventListeners", {
    objectId: result.objectId!,
  })
  const byType: Record<string, number> = {}
  for (const { type } of listeners) {
    byType[type] = (byType[type] ?? 0) + 1
  }
  return byType
}

// The `data-slot` of every element that's alive and out of the page.
async function detachedSlots(cdp: CDPSession, objectGroup: string) {
  const { result } = await cdp.send("Runtime.evaluate", {
    expression: "HTMLElement.prototype",
    objectGroup,
  })
  const { objects } = await cdp.send("Runtime.queryObjects", {
    prototypeObjectId: result.objectId!,
    objectGroup,
  })
  const { result: slots } = await cdp.send("Runtime.callFunctionOn", {
    objectId: objects.objectId!,
    // Prototypes, like HTMLDivElement.prototype, are among the objects, and
    // their getters throw.
    functionDeclaration: `function () {
      const detached = (el) => {
        try {
          return !el.isConnected && el.hasAttribute("data-slot")
        } catch {
          return false
        }
      }
      return this.filter(detached).map((el) => el.dataset.slot).sort()
    }`,
    returnByValue: true,
  })
  return slots.value as string[]
}

/**
 * Waits for the page to go quiet, collects garbage, then reads every leak
 * signal. A popup's exit and a tooltip's warm delay end well within `quiet`.
 */
async function snapshot(page: Page, cdp: CDPSession, quiet = 1000) {
  await page.waitForTimeout(quiet)
  await waitFrames(page, 2)
  const objectGroup = "leaks"
  await cdp.send("HeapProfiler.collectGarbage")
  const listeners = await listenersNow(cdp)
  const detached = await detachedSlots(cdp, objectGroup)
  await cdp.send("Runtime.releaseObjectGroup", { objectGroup })
  const inPage = await page.evaluate(() => {
    const view = window as unknown as {
      __pendingFrames: Set<number>
      __layers: () => { open: number; listening: boolean }
    }
    return { frames: view.__pendingFrames.size, layers: view.__layers() }
  })
  await cdp.send("HeapProfiler.collectGarbage")
  const { usedSize } = await cdp.send("Runtime.getHeapUsage")
  return { listeners, detached, ...inPage, heap: usedSize }
}

/**
 * Listeners on the window and the document by event type, read at once,
 * without waiting for the page to go quiet. For what must be gone mid-gesture.
 */
async function listenersNow(cdp: CDPSession) {
  const objectGroup = "listeners"
  const listeners = {
    window: await listenersOn(cdp, "window", objectGroup),
    document: await listenersOn(cdp, "document", objectGroup),
  }
  await cdp.send("Runtime.releaseObjectGroup", { objectGroup })
  return listeners
}

/** Listeners added and not removed since `before`, by target and event type. */
function addedListeners(
  before: Pick<LeakSnapshot, "listeners">,
  after: Pick<LeakSnapshot, "listeners">
) {
  const added: Record<string, number> = {}
  for (const target of ["window", "document"] as const) {
    const types = new Set([
      ...Object.keys(before.listeners[target]),
      ...Object.keys(after.listeners[target]),
    ])
    for (const type of types) {
      const delta =
        (after.listeners[target][type] ?? 0) -
        (before.listeners[target][type] ?? 0)
      if (delta) {
        added[`${target} ${type}`] = delta
      }
    }
  }
  return added
}

export {
  addedListeners,
  countFrames,
  type LeakSnapshot,
  listenersNow,
  snapshot,
}
