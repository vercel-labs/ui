// @vitest-environment jsdom
import { expect, test, vi } from "vitest"
import { focusFromSurroundings } from "../src/foundation/forms/text-field"

test("a press on a button that leaves the page as it's pressed doesn't focus the field", () => {
  const group = document.body.appendChild(document.createElement("div"))
  const item = group.appendChild(document.createElement("div"))
  const remove = item.appendChild(document.createElement("button"))
  const field = { focus: vi.fn() }
  remove.addEventListener("click", () => item.remove())
  group.addEventListener("click", (event) =>
    focusFromSurroundings(event, group, field as never)
  )
  remove.click()
  expect(field.focus).not.toHaveBeenCalled()
})

test("a press on the group's own text still focuses the field", () => {
  const group = document.body.appendChild(document.createElement("div"))
  const text = group.appendChild(document.createElement("span"))
  const field = { focus: vi.fn() }
  group.addEventListener("click", (event) =>
    focusFromSurroundings(event, group, field as never)
  )
  text.click()
  expect(field.focus).toHaveBeenCalledOnce()
})
