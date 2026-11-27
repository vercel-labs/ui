// @vitest-environment jsdom
// iOS momentum can leave a swiped scroll-snap sheet a pixel or two short of
// closed, where its visibility check still counts it as shown.
import { afterEach, expect, test, vi } from "vitest"
import { sheetPhysics } from "../src/foundation/motion/physics"
import type { SheetDriver } from "../src/foundation/popups/sheet-driver"
import { createScrollSnapDriver } from "../src/foundation/popups/sheet-scroll-snap"

Element.prototype.animate = function () {
  return { onfinish: null, startTime: 0, cancel() {} } as never
}
globalThis.IntersectionObserver = class {
  observe() {}
  disconnect() {}
} as never
Object.assign(window, { ScrollTimeline: class {} })

let driver: SheetDriver | undefined
afterEach(() => {
  driver?.destroy()
  document.body.replaceChildren()
  vi.useRealTimers()
})

function setup(dismissible = () => true) {
  const host = document.createElement("div")
  const sheet = document.createElement("div")
  host.append(sheet)
  document.body.append(host)
  const seen = { dismissed: 0, rests: [] as (string | null)[] }
  const none = () => {}
  driver = createScrollSnapDriver({
    sheet,
    host,
    side: () => "bottom",
    config: () => ({
      snapPoints: [{ id: "full", extent: 400 }],
      dimension: 1000,
      dismissible: dismissible(),
      expandOnScroll: true,
      physics: sheetPhysics.ios,
    }),
    size: () => 400,
    closedExtent: () => -120,
    reducedMotion: () => false,
    owns: () => true,
    canMouseDrag: () => true,
    onSnap: none,
    onRest: (id) => seen.rests.push(id),
    onDismiss: () => seen.dismissed++,
    onDismissAttempt: none,
    onDragChange: none,
    isInteractive: () => false,
    onFrame: none,
    onMotion: none,
    onMotionStart: none,
  })
  return { host, seen }
}

function swipeTo(host: HTMLElement, scrollTop: number) {
  host.dispatchEvent(new Event("touchstart"))
  host.scrollTop = scrollTop
  host.dispatchEvent(new Event("scroll"))
  host.dispatchEvent(new Event("touchend"))
  host.dispatchEvent(new Event("scrollend"))
  vi.runAllTimers()
}

test("a swipe that comes to rest just short of closed closes the sheet", () => {
  vi.useFakeTimers()
  const { host, seen } = setup()
  driver!.open("full", false)
  swipeTo(host, 2)
  expect(seen.dismissed).toBe(1)
})

test("a swipe that comes to rest further up snaps back open", () => {
  vi.useFakeTimers()
  const { host, seen } = setup()
  driver!.open("full", false)
  swipeTo(host, 300)
  expect(seen.dismissed).toBe(0)
  expect(seen.rests.at(-1)).toBe("full")
})

test("a sheet opened without dismissal and made dismissible stays open at its detent", () => {
  vi.useFakeTimers()
  let dismissible = false
  const { host, seen } = setup(() => dismissible)
  driver!.open("full", false)
  dismissible = true
  swipeTo(host, 10)
  swipeTo(host, 0)
  expect(seen.dismissed).toBe(0)
})
