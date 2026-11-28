// @vitest-environment jsdom
// WebKit gives a tap's click to a nearby clickable node, like a marker button
// above a timeline, unless the surface under the finger listens for clicks.
import { afterEach, expect, test, vi } from "vitest"
import { colorPicker } from "../src/components/color-picker/color-picker"
import { slider } from "../src/components/slider/slider"
import { mount } from "../src/testing/mount"

const unmounts: (() => void)[] = []
afterEach(() => {
  unmounts.splice(0).forEach((unmount) => unmount())
  vi.restoreAllMocks()
  document.body.replaceChildren()
})

function clickListeners() {
  const targets = new Set<EventTarget>()
  const add = EventTarget.prototype.addEventListener
  vi.spyOn(EventTarget.prototype, "addEventListener").mockImplementation(
    function (this: EventTarget, type, ...rest) {
      if (type === "click") {
        targets.add(this)
      }
      return add.call(this, type, ...rest)
    }
  )
  return targets
}

test("a slider's control listens for clicks", () => {
  const targets = clickListeners()
  const view = mount(
    slider,
    { defaultValue: 50 },
    `<div><control><track><thumb><thumb-input aria-label="Volume"></thumb-input></thumb></track></control></div>`
  )
  unmounts.push(view.unmount)
  expect(targets.has(view.part("control")!)).toBe(true)
})

test("a color picker's area and channel slider listen for clicks", () => {
  const targets = clickListeners()
  const view = mount(
    colorPicker,
    { defaultValue: "#3366cc" },
    `<div><area><area-thumb></area-thumb></area><slider channel="hue"><slider-thumb channel="hue"></slider-thumb></slider></div>`
  )
  unmounts.push(view.unmount)
  expect(targets.has(view.part("area")!)).toBe(true)
  expect(targets.has(view.part("slider")!)).toBe(true)
})
