// @vitest-environment jsdom
import { afterEach, describe, expect, test } from "vitest"
import { sheetPhysics } from "../src/foundation/motion/physics"
import type { SheetDriver, SheetDriverOptions } from "../src/foundation/popups/sheet-driver"
import { createPointerDriver } from "../src/foundation/popups/sheet-pointer"
import { createScrollSnapDriver } from "../src/foundation/popups/sheet-scroll-snap"

const animations: { onfinish: (() => void) | null }[] = []
Element.prototype.animate = function () {
  const animation = { onfinish: null, startTime: 0, cancel() {} }
  animations.push(animation)
  return animation as never
}
const finishLast = () => animations.at(-1)?.onfinish?.()

let leaveView: (() => void) | undefined
globalThis.IntersectionObserver = class {
  constructor(callback: (entries: { isIntersecting: boolean }[]) => void) {
    leaveView = () => callback([{ isIntersecting: false }])
  }
  observe() {}
  disconnect() {}
} as never

let driver: SheetDriver | undefined
afterEach(() => {
  driver?.destroy()
  document.body.replaceChildren()
  animations.length = 0
})

function setup(create: (options: SheetDriverOptions) => SheetDriver) {
  const host = document.createElement("div")
  const sheet = document.createElement("div")
  host.append(sheet)
  document.body.append(host)
  const rests: (string | null)[] = []
  const none = () => {}
  driver = create({
    sheet,
    host,
    side: () => "bottom",
    config: () => ({
      snapPoints: [{ id: "full", extent: 400 }],
      dimension: 1000,
      dismissible: true,
      expandOnScroll: true,
      physics: sheetPhysics.ios,
    }),
    size: () => 400,
    closedExtent: () => -120,
    reducedMotion: () => false,
    owns: () => true,
    canMouseDrag: () => true,
    onSnap: none,
    onRest: (id) => rests.push(id),
    onDismiss: () => driver!.snapTo("full", "imperative"),
    onDismissAttempt: none,
    onDragChange: none,
    isInteractive: () => false,
    onFrame: none,
    onMotion: none,
    onMotionStart: none,
  })
  driver.open("full", false)
  return { sheet, rests }
}

const pointer = (type: string, clientY: number) =>
  new PointerEvent(type, { bubbles: true, button: 0, pointerId: 1, pointerType: "mouse", clientY })

describe("a swipe the popup refuses snaps back", () => {
  test("with the pointer driver", () => {
    const { sheet, rests } = setup(createPointerDriver)
    sheet.dispatchEvent(pointer("pointerdown", 100))
    for (const y of [150, 300, 500]) document.dispatchEvent(pointer("pointermove", y))
    document.dispatchEvent(pointer("pointerup", 500))
    finishLast()
    expect(rests.at(-1)).toBe("full")
    expect(driver!.target()).toBe("full")
  })

  test("with the scroll-snap driver", () => {
    const { rests } = setup(createScrollSnapDriver)
    leaveView!()
    finishLast()
    expect(rests.at(-1)).toBe("full")
    expect(driver!.target()).toBe("full")
  })
})
