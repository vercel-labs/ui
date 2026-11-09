import { test, type Page } from "@playwright/test"

// What the page keeps on `window.__perf`: DOM calls counted since the last
// reset, and the renders and subscriptions a perf fixture counts itself.
type PerfCounts = {
  counts: Record<string, number>
  renders: Record<string, number>
  subscriptions: number
}

// Counts DOM calls per interaction by wrapping DOM prototypes, so core stays
// free of instrumentation. Runs in the page before any fixture code, so it
// must not close over anything: Playwright sends its source.
function countDomCalls() {
  const perf = {
    counts: {} as Record<string, number>,
    renders: {} as Record<string, number>,
    subscriptions: 0,
    reset() {
      perf.counts = {}
      perf.renders = {}
      perf.subscriptions = 0
    },
  }
  Object.assign(window, { __perf: perf })

  const count = <Target extends object>(
    target: Target,
    name: keyof Target & string
  ) => {
    const original = target[name] as (...args: unknown[]) => unknown
    Object.defineProperty(target, name, {
      configurable: true,
      writable: true,
      value(this: unknown, ...args: unknown[]) {
        perf.counts[name] = (perf.counts[name] ?? 0) + 1
        return original.apply(this, args)
      },
    })
  }

  // Ordering calls: the sort every collection did on each key (C1 to C3).
  count(Node.prototype, "compareDocumentPosition")
  // Steps of a walk that puts a long list in order, which costs as much as
  // the sort it replaces.
  count(TreeWalker.prototype, "nextNode")
  // `applyAttrs` reads one attribute per written one, so this shows how many
  // parts a store change reached (C5).
  count(Element.prototype, "getAttribute")
  count(Element.prototype, "getBoundingClientRect")
  // Style reads, which force a style recalculation after a write.
  count(window, "getComputedStyle")
  // Frames asked for. Each keeps the page drawing frames, so the next key
  // press waits for its frame instead of showing at once.
  count(window, "requestAnimationFrame")
  const countGetter = (target: object, name: string) => {
    const descriptor = Object.getOwnPropertyDescriptor(target, name)!
    Object.defineProperty(target, name, {
      configurable: true,
      get() {
        perf.counts[name] = (perf.counts[name] ?? 0) + 1
        return descriptor.get!.call(this)
      },
    })
  }

  // Layout reads positioning makes, which an idle open popup shouldn't (H7).
  countGetter(HTMLElement.prototype, "offsetWidth")
  countGetter(HTMLElement.prototype, "offsetHeight")
  // Chromium finds a control's labels by walking the whole document, so
  // reading `labels` for every control makes mounting many of them quadratic.
  for (const target of [
    ElementInternals.prototype,
    HTMLInputElement.prototype,
    HTMLButtonElement.prototype,
    HTMLSelectElement.prototype,
    HTMLTextAreaElement.prototype,
  ]) {
    countGetter(target, "labels")
  }
}

/** Installs the counters on every page the test opens. Call before `open()`. */
async function countCalls(page: Page) {
  await page.addInitScript(countDomCalls)
}

/** Zeroes every counter, so what follows counts only the interaction. */
async function resetCounts(page: Page) {
  await page.evaluate(() =>
    (window as unknown as { __perf: { reset: () => void } }).__perf.reset()
  )
}

/** The counts since the last reset. */
async function readCounts(page: Page) {
  return page.evaluate(() => {
    const { counts, renders, subscriptions } = (
      window as unknown as { __perf: PerfCounts }
    ).__perf
    return { counts: { ...counts }, renders: { ...renders }, subscriptions }
  })
}

// Item counts the gates run at. Set PERF_SIZES=10,500,2000 to measure more
// for a report. The bound is the same at every size, so work that grows with
// the item count fails at the larger one.
const sizes = (process.env.PERF_SIZES ?? "10,500").split(",").map(Number)

/** Waits for `frames` animation frames in the page, for counting what runs while nothing happens. */
async function waitFrames(page: Page, frames: number) {
  await page.evaluate(
    (count) =>
      new Promise<void>((resolve) => {
        let left = count
        const step = () => (--left ? requestAnimationFrame(step) : resolve())
        requestAnimationFrame(step)
      }),
    frames
  )
}

/**
 * Style recalculations while `run` runs, and the elements they restyled, from
 * a Chromium trace. An inherited property changing on an element restyles
 * everything inside it.
 */
async function countRestyles(page: Page, run: () => Promise<unknown>) {
  // Only persistent contexts have no browser, and the specs never use one.
  const browser = page.context().browser()!
  await browser.startTracing(page, { categories: ["devtools.timeline"] })
  await run()
  const trace = JSON.parse((await browser.stopTracing()).toString()) as {
    traceEvents: {
      name: string
      ph: string
      args?: { elementCount?: number }
    }[]
  }
  const recalcs = trace.traceEvents.filter(
    ({ name, ph }) => name === "UpdateLayoutTree" && ph === "X"
  )
  return {
    recalcs: recalcs.length,
    elements: recalcs.reduce(
      (sum, { args }) => sum + (args?.elementCount ?? 0),
      0
    ),
    each: recalcs.map(({ args }) => args?.elementCount ?? 0),
  }
}

/** Prints a gate's counts when PERF_REPORT is set. */
function report(
  name: string,
  n: number,
  counts: Awaited<ReturnType<typeof readCounts>>
) {
  if (process.env.PERF_REPORT) {
    console.log(
      `[perf] ${test.info().project.name} ${name} n=${n} ${JSON.stringify(counts)}`
    )
  }
}

/**
 * Counts the frames from the next key press until the first element
 * `selector` matches settles: shown, in place, with focus inside it or not,
 * and the same two frames later. Call it before the press, then await what
 * it returns. Each frame is read once it has rendered, so reading forces no
 * layout.
 */
async function watchSettle(page: Page, selector: string) {
  await page.evaluate((selector) => {
    const settledFrame = new Promise<number>((resolve) => {
      const look = () => {
        const el = document.querySelector(selector)
        if (
          !el?.checkVisibility({
            opacityProperty: true,
            visibilityProperty: true,
          })
        ) {
          return undefined
        }
        const { x, y, width, height } = el.getBoundingClientRect()
        return `${x} ${y} ${width} ${height} ${el.contains(document.activeElement)}`
      }
      let frames = 0
      let settled: { looks: string; frame: number; same: number } | undefined
      const rendered = () => {
        frames++
        const looks = look()
        if (looks !== undefined && looks === settled?.looks) {
          settled.same++
        } else {
          settled =
            looks === undefined ? undefined : { looks, frame: frames, same: 0 }
        }
        // Gives up after a second of frames, for an element that never settles.
        if (settled?.same === 2 || frames >= 60) {
          return resolve(settled?.same === 2 ? settled.frame : Infinity)
        }
        requestAnimationFrame(next)
      }
      // The message arrives once the frame has rendered.
      const next = () => {
        const channel = new MessageChannel()
        channel.port1.onmessage = rendered
        channel.port2.postMessage(0)
      }
      addEventListener("keydown", () => requestAnimationFrame(next), {
        capture: true,
        once: true,
      })
    })
    Object.assign(window, { __settledFrame: settledFrame })
  }, selector)
  return () =>
    page.evaluate(
      () =>
        (window as unknown as { __settledFrame: Promise<number> })
          .__settledFrame
    )
}

export {
  countCalls,
  countRestyles,
  readCounts,
  report,
  resetCounts,
  sizes,
  waitFrames,
  watchSettle,
}
