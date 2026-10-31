// @vitest-environment jsdom
import { beforeAll, expect, test } from "vitest"
import { defineCheckboxElements, defineCheckboxGroupElements } from "../src/checkbox"

const wait = () => new Promise((resolve) => setTimeout(resolve, 10))

beforeAll(() => {
  // jsdom has no form values or animations, which a checkbox sets and reads, and
  // never calls formDisabledCallback, so a group disabled at the start stays so here.
  ElementInternals.prototype.setFormValue ??= () => {}
  ElementInternals.prototype.setValidity ??= () => {}
  ;(Element.prototype as { getAnimations?: () => Animation[] }).getAnimations ??= () => []
  defineCheckboxElements()
  defineCheckboxGroupElements()
})

async function mount(html: string) {
  document.body.innerHTML = html
  await wait()
  return {
    group: document.querySelector("ui-checkbox-group")!,
    boxes: [...document.querySelectorAll("ui-checkbox")],
  }
}

test("a group disabled and enabled again after mount enables its checkboxes", async () => {
  const { group, boxes } = await mount(
    `<ui-checkbox-group aria-label="Toppings"><ui-checkbox value="cheese" aria-label="Cheese"></ui-checkbox></ui-checkbox-group>`,
  )
  group.setAttribute("disabled", "")
  await wait()
  expect(boxes[0].getAttribute("aria-disabled")).toBe("true")
  group.removeAttribute("disabled")
  await wait()
  expect(boxes[0].getAttribute("aria-disabled")).toBe(null)
  expect(boxes[0].hasAttribute("disabled")).toBe(false)
})

test("a checkbox disabled by its author stays disabled when its group is enabled again", async () => {
  const { group, boxes } = await mount(
    `<ui-checkbox-group aria-label="Toppings"><ui-checkbox value="cheese" aria-label="Cheese" disabled="disabled"></ui-checkbox><ui-checkbox value="olives" aria-label="Olives"></ui-checkbox></ui-checkbox-group>`,
  )
  group.setAttribute("disabled", "")
  await wait()
  group.removeAttribute("disabled")
  await wait()
  expect(boxes.map((box) => box.getAttribute("aria-disabled"))).toEqual(["true", null])
})
