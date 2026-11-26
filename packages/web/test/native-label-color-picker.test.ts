// @vitest-environment jsdom
import { beforeAll, expect, test } from "vitest"
import { defineColorPickerElements } from "../src/color-picker"
import { defineFieldElements } from "../src/field"
import { defineLabelElements } from "../src/label"

const wait = () => new Promise((resolve) => setTimeout(resolve, 10))

beforeAll(() => {
  ;(
    Element.prototype as { getAnimations?: () => Animation[] }
  ).getAnimations ??= () => []
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver
  ElementInternals.prototype.setFormValue ??= () => {}
  ElementInternals.prototype.setValidity ??= () => {}
  defineColorPickerElements()
  defineFieldElements()
  defineLabelElements()
})

const picker = (id = "") => `
  <ui-color-picker ${id && `id="${id}"`} default-value="#0ea5e9">
    <ui-color-picker-input><input aria-label="Hex" /></ui-color-picker-input>
  </ui-color-picker>`

test.each([
  [
    "a field's native label",
    `<ui-field><ui-field-label as-child><label>Brand</label></ui-field-label>${picker()}</ui-field>`,
  ],
  [
    "a native label in a label part",
    `<ui-label as-child><label for="brand">Brand</label></ui-label>${picker("brand")}`,
  ],
])("a press on %s focuses into the color picker", async (_, html) => {
  document.body.innerHTML = html
  await wait()
  const label = document.querySelector("label")!
  expect(label.control).toBe(document.querySelector("ui-color-picker"))
  label.click()
  await wait()
  expect(document.activeElement?.getAttribute("aria-label")).toBe("Hex")
})
