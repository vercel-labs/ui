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

test("a link inside a field's native label for a color picker still follows", async () => {
  document.body.innerHTML = `<ui-field><ui-field-label as-child><label>Brand <a href="#guide">guide</a></label></ui-field-label>${picker()}</ui-field>`
  await wait()
  const link = document.querySelector("a")!
  const event = new MouseEvent("click", { bubbles: true, cancelable: true })
  link.dispatchEvent(event)
  await wait()
  expect(event.defaultPrevented).toBe(false)
  expect(document.activeElement).not.toBe(document.querySelector("input"))
})

test("a native label leaves a control that takes focus to the browser", async () => {
  document.body.innerHTML = `<ui-field><ui-field-label as-child><label>Upload</label></ui-field-label><input type="file" tabindex="-1" /></ui-field>`
  await wait()
  const label = document.querySelector("label")!
  expect(label.control).toBe(document.querySelector("input"))
  const event = new MouseEvent("click", { bubbles: true, cancelable: true })
  label.dispatchEvent(event)
  expect(event.defaultPrevented).toBe(false)
})

test("a press inside a color picker that a field's native label wraps stays where it lands", async () => {
  document.body.innerHTML = `<ui-field><ui-field-label as-child><label>Brand ${picker().replace("</ui-color-picker>", '<button type="button">Other</button></ui-color-picker>')}</label></ui-field-label></ui-field>`
  await wait()
  const other = document.querySelector("button")!
  other.focus()
  other.click()
  await wait()
  expect(document.activeElement).toBe(other)
})
