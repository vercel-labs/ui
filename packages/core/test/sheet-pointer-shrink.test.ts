// @vitest-environment jsdom
import { afterEach, expect, test } from "vitest"
import { sheetPhysics } from "../src/foundation/motion/physics"
import type { SheetDriver } from "../src/foundation/popups/sheet-driver"
import { createPointerDriver } from "../src/foundation/popups/sheet-pointer"

const animations: Keyframe[][] = []
Element.prototype.animate = function (keyframes) {
  animations.push(keyframes as Keyframe[])
  return { onfinish: null, startTime: 0, cancel() {} } as never
}

let driver: SheetDriver | undefined
afterEach(() => {
  driver?.destroy()
  document.body.replaceChildren()
  animations.length = 0
})

function setup() {
  const host = document.createElement("div")
  const sheet = document.createElement("div")
  host.append(sheet)
  document.body.append(host)
  const seen = { size: 400, rests: [] as (string | null)[] }
  const none = () => {}
  driver = createPointerDriver({
    sheet,
    host,
    side: () => "bottom",
    config: () => ({
      snapPoints: [{ id: "content", extent: seen.size }],
      dimension: 800,
      dismissible: true,
      expandOnScroll: true,
      physics: sheetPhysics.ios,
    }),
    size: () => seen.size,
    closedExtent: () => 0,
    reducedMotion: () => false,
    owns: () => true,
    canMouseDrag: () => true,
    onSnap: none,
    onRest: (id) => seen.rests.push(id),
    onDismiss: none,
    onDismissAttempt: none,
    onDragChange: none,
    isInteractive: () => false,
    onFrame: none,
    onMotion: none,
    onMotionStart: none,
  })
  driver.open("content", false)
  return { sheet, seen }
}

test("a resting sheet whose content shrinks stays on the edge it's attached to", () => {
  const { sheet, seen } = setup()
  seen.size = 200
  driver!.relayout(false)
  expect(animations).toEqual([])
  expect(sheet.style.translate).toBe("0 0px")
})

test("a resting sheet whose content grows still slides to its new size", () => {
  const { seen } = setup()
  seen.size = 600
  driver!.relayout(false)
  expect(animations).toHaveLength(1)
})
