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
  const seen = {
    size: 400,
    rests: [] as (string | null)[],
    snaps: [] as string[],
    frames: [] as number[],
  }
  const none = () => {}
  driver = createPointerDriver({
    sheet,
    host,
    side: () => "bottom",
    config: () => ({
      snapPoints: [
        ...(seen.size > 300 ? [{ id: "half", extent: 300 }] : []),
        { id: "content", extent: seen.size },
      ],
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
    onSnap: (id) => seen.snaps.push(id),
    onRest: (id) => seen.rests.push(id),
    onDismiss: none,
    onDismissAttempt: none,
    onDragChange: none,
    isInteractive: () => false,
    onFrame: (extent) => seen.frames.push(extent),
    onMotion: none,
    onMotionStart: none,
  })
  return { sheet, seen }
}

test("a resting sheet whose content shrinks stays on the edge it's attached to", () => {
  const { sheet, seen } = setup()
  driver!.open("content", false)
  seen.size = 200
  driver!.relayout(false)
  expect(animations).toEqual([])
  expect(sheet.style.translate).toBe("0 0px")
  expect(seen.frames.at(-1)).toBe(200)
})

test("a resting sheet whose content grows still slides to its new size", () => {
  const { seen } = setup()
  driver!.open("content", false)
  seen.size = 600
  driver!.relayout(false)
  expect(animations).toHaveLength(1)
})

test("a resting sheet whose snap point goes as its content shrinks settles on the one left", () => {
  const { sheet, seen } = setup()
  driver!.open("half", false)
  seen.size = 200
  driver!.relayout(false)
  expect(animations).toEqual([])
  expect(sheet.style.translate).toBe("0 0px")
  expect(seen.snaps).toEqual(["content"])
  expect(seen.rests.at(-1)).toBe("content")
  expect(driver!.target()).toBe("content")
})
