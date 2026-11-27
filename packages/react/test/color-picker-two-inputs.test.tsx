// @vitest-environment jsdom
import * as React from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, expect, test, vi } from "vitest"
import {
  ColorPicker,
  ColorPickerInput,
  createColorPickerController,
} from "../src/color-picker"

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

let root: Root | undefined

afterEach(async () => {
  await React.act(async () => root?.unmount())
  root = undefined
  document.body.replaceChildren()
})

test("every input of a picker shows its value and takes a typed color", async () => {
  const controller = createColorPickerController()
  const onValueChange = vi.fn()
  root = createRoot(document.body.appendChild(document.createElement("div")))
  await React.act(async () =>
    root!.render(
      <ColorPicker
        aria-label="Background"
        defaultValue="#F97316"
        controller={controller}
        onValueChange={onValueChange}
      >
        <ColorPickerInput aria-label="First" />
        <ColorPickerInput aria-label="Second" />
      </ColorPicker>
    )
  )
  const [first, second] = document.querySelectorAll("input[aria-label]")
  const values = () =>
    [first, second].map((input) => (input as HTMLInputElement).value)
  await React.act(async () => controller.setValue("#008200"))
  expect(values()).toEqual(["#008200", "#008200"])
  await React.act(async () => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value"
    )!.set!.call(first, "#123456")
    first.dispatchEvent(new Event("input", { bubbles: true }))
    first.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
    )
  })
  expect(onValueChange).toHaveBeenLastCalledWith("#123456", expect.anything())
  expect(values()).toEqual(["#123456", "#123456"])
})
