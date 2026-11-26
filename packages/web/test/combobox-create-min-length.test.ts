// @vitest-environment jsdom
import { beforeAll, expect, test } from "vitest"
import { defineComboboxElements } from "../src/combobox"

const wait = () => new Promise((resolve) => setTimeout(resolve, 10))

beforeAll(() => {
  ;(
    Element.prototype as { getAnimations?: () => Animation[] }
  ).getAnimations ??= () => []
  ElementInternals.prototype.setFormValue ??= () => {}
  ElementInternals.prototype.setValidity ??= () => {}
  defineComboboxElements()
})

test("a create option with a minimum length stays hidden for a shorter query", async () => {
  document.body.innerHTML = `
    <ui-combobox multiple>
      <ui-combobox-chips><ui-combobox-input><input aria-label="Labels" /></ui-combobox-input></ui-combobox-chips>
      <ui-combobox-content>
        <ui-combobox-list>
          <ui-combobox-item value="bug">Bug</ui-combobox-item>
          <ui-combobox-item value="feature">Feature</ui-combobox-item>
          <ui-combobox-create min-length="2">Create</ui-combobox-create>
        </ui-combobox-list>
      </ui-combobox-content>
    </ui-combobox>`
  await wait()
  const input = document.querySelector("input")!
  input.focus()
  input.value = "B"
  input.dispatchEvent(new InputEvent("input", { bubbles: true }))
  await wait()
  const create = document.querySelector("ui-combobox-create")!
  expect(create.hidden).toBe(true)
  input.value = "Bx"
  input.dispatchEvent(new InputEvent("input", { bubbles: true }))
  await wait()
  expect(create.hidden).toBe(false)
})
