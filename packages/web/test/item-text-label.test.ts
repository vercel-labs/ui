// @vitest-environment jsdom
import { beforeAll, expect, test } from "vitest"
import { defineComboboxElements } from "../src/combobox"
import { defineSelectElements } from "../src/select"

const wait = (ms = 10) => new Promise((resolve) => setTimeout(resolve, ms))

beforeAll(() => {
  ;(
    Element.prototype as { getAnimations?: () => Animation[] }
  ).getAnimations ??= () => []
  ElementInternals.prototype.setFormValue ??= () => {}
  ElementInternals.prototype.setValidity ??= () => {}
  defineComboboxElements()
  defineSelectElements()
})

test("an empty item text written in the page shows its item's label", async () => {
  document.body.innerHTML = `
    <ui-combobox>
      <ui-combobox-input><input aria-label="Assignee" /></ui-combobox-input>
      <ui-combobox-content>
        <ui-combobox-list>
          <ui-combobox-item value="kai" label="Kai Rivera"><ui-combobox-item-text></ui-combobox-item-text></ui-combobox-item>
          <ui-combobox-item value="ada" label="Ada Park"><ui-combobox-item-text></ui-combobox-item-text></ui-combobox-item>
        </ui-combobox-list>
      </ui-combobox-content>
    </ui-combobox>
    <ui-select>
      <ui-select-trigger><button><ui-select-value></ui-select-value></button></ui-select-trigger>
      <ui-select-content>
        <ui-select-item value="apple" label="Apple"><ui-select-item-text></ui-select-item-text></ui-select-item>
      </ui-select-content>
    </ui-select>`
  await wait()
  ;(
    document.querySelector("ui-combobox") as HTMLElement & { open: boolean }
  ).open = true
  await wait(50)
  const texts = [
    ...document.querySelectorAll("ui-combobox-item-text, ui-select-item-text"),
  ].map((el) => el.textContent)
  expect(texts.sort()).toEqual(["Ada Park", "Apple", "Kai Rivera"])
})
