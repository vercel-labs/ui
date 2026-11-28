// @vitest-environment jsdom
import { afterEach, expect, test } from "vitest"
import { sheetPhysics } from "../src/foundation/motion/physics"
import type { SheetDriver } from "../src/foundation/popups/sheet-driver"
import { createPointerDriver } from "../src/foundation/popups/sheet-pointer"

const animations: { onfinish: (() => void) | null }[] = []
Element.prototype.animate = function () {
  const animation = { onfinish: null, startTime: 0, cancel() {} }
  animations.push(animation)
  return animation as never
}

let driver: SheetDriver | undefined
afterEach(() => {
  driver?.destroy()
  document.body.replaceChildren()
  animations.length = 0
})

const pointer = (type: string, clientY: number) =>
  new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    button: 0,
    pointerId: 1,
    pointerType: "mouse",
    clientY,
  })

test("a sheet sent back from a refused snap targets where it goes back to while it settles", () => {
  const sheet = document.createElement("div")
  document.body.append(sheet)
  const rests: (string | null)[] = []
  const none = () => {}
  // A controlled drawer refuses the snap until its prop follows, and sends the sheet back.
  const sheetDriver: SheetDriver = createPointerDriver({
    sheet,
    host: sheet,
    side: () => "bottom",
    config: () => ({
      snapPoints: [
        { id: "half", extent: 500 },
        { id: "full", extent: 1000 },
      ],
      dimension: 1000,
      dismissible: true,
      expandOnScroll: true,
      physics: sheetPhysics.ios,
    }),
    size: () => 1000,
    closedExtent: () => -120,
    reducedMotion: () => false,
    owns: () => true,
    canMouseDrag: () => true,
    onSnap: (id) => id === "full" && sheetDriver.snapTo("half", "imperative"),
    onRest: (id) => rests.push(id),
    onDismiss: none,
    onDismissAttempt: none,
    onDragChange: none,
    isInteractive: () => false,
    onFrame: none,
    onMotion: none,
    onMotionStart: none,
  })
  driver = sheetDriver
  sheetDriver.open("half", false)
  sheet.dispatchEvent(pointer("pointerdown", 500))
  for (const y of [450, 350, 250, 150]) {
    document.dispatchEvent(pointer("pointermove", y))
  }
  document.dispatchEvent(pointer("pointerup", 150))
  expect(sheetDriver.target()).toBe("half")
  animations.at(-1)?.onfinish?.()
  expect(rests.at(-1)).toBe("half")
})
