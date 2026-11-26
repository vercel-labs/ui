// @vitest-environment jsdom
import * as React from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeAll, expect, test } from "vitest"
import {
  ColorPicker,
  ColorPickerSwatchItem,
  ColorPickerSwatches,
} from "../src/color-picker"
import { Popover, PopoverContent, PopoverTrigger } from "../src/popover"

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

beforeAll(() => {
  HTMLElement.prototype.showPopover ??= function () {}
  HTMLElement.prototype.hidePopover ??= function () {}
  Element.prototype.getAnimations ??= () => []
  Element.prototype.checkVisibility = () => true
  document.head.append(
    Object.assign(document.createElement("style"), {
      textContent: "[popover] { display: block !important }",
    })
  )
})

let root: Root | undefined

afterEach(async () => {
  await React.act(async () => root?.unmount())
  root = undefined
  document.body.replaceChildren()
})

const presets = ["#DC2626", "#EA580C", "#7C3AED", "#64748B"]

async function open(value: string) {
  root = createRoot(document.body.appendChild(document.createElement("div")))
  await React.act(async () =>
    root!.render(
      <ColorPicker aria-label="Design color" defaultValue={value}>
        <Popover>
          <PopoverTrigger>Recolor</PopoverTrigger>
          <PopoverContent aria-label="Recolor">
            <ColorPickerSwatches aria-label="Presets">
              {presets.map((preset) => (
                <ColorPickerSwatchItem key={preset} value={preset} />
              ))}
            </ColorPickerSwatches>
          </PopoverContent>
        </Popover>
      </ColorPicker>
    )
  )
  const trigger = document.querySelector("button")!
  await React.act(async () => {
    trigger.click()
    await new Promise((resolve) => setTimeout(resolve, 20))
  })
  return document.activeElement as HTMLElement
}

test("a popover that opens on the presets focuses the selected one", async () => {
  const focused = await open("#7C3AED")
  expect(focused.getAttribute("role")).toBe("option")
  expect(focused.getAttribute("aria-selected")).toBe("true")
})

test("with no preset selected, it focuses the first", async () => {
  const focused = await open("#123456")
  expect(focused).toBe(document.querySelector("[role=option]"))
})
