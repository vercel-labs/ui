// @vitest-environment jsdom
import { beforeAll, expect, test } from "vitest"
import { defineCheckboxElements } from "../src/checkbox"
import { defineInputElements } from "../src/input"
import { defineLabelElements } from "../src/label"

const wait = () => new Promise((resolve) => setTimeout(resolve, 10))

beforeAll(() => {
  ;(
    Element.prototype as { getAnimations?: () => Animation[] }
  ).getAnimations ??= () => []
  ElementInternals.prototype.setFormValue ??= () => {}
  ElementInternals.prototype.setValidity ??= () => {}
  defineLabelElements()
  defineInputElements()
  defineCheckboxElements()
})

test("a ui-label and a native label around a checkbox get their own ids", async () => {
  document.body.innerHTML = `
    <ui-label for="email">Email</ui-label>
    <ui-input><input id="email" /></ui-input>
    <label><ui-checkbox></ui-checkbox> Subscribe</label>`
  await wait()
  const [label, native] =
    document.querySelectorAll<HTMLElement>("ui-label, label")
  expect(label.id).not.toBe(native.id)
  expect(
    document.getElementById("email")!.getAttribute("aria-labelledby")
  ).toBe(label.id)
  expect(
    document.querySelector("ui-checkbox")!.getAttribute("aria-labelledby")
  ).toBe(native.id)
})
