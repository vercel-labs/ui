// @vitest-environment jsdom
import { beforeAll, expect, test } from "vitest"
import { defineComboboxElements } from "../src/combobox"
import { defineListboxElements } from "../src/listbox"

const wait = (ms = 10) => new Promise((resolve) => setTimeout(resolve, ms))

beforeAll(() => {
  ;(
    Element.prototype as { getAnimations?: () => Animation[] }
  ).getAnimations ??= () => []
  ElementInternals.prototype.setFormValue ??= () => {}
  ElementInternals.prototype.setValidity ??= () => {}
  defineComboboxElements()
  defineListboxElements()
})

const items = Array.from({ length: 50 }, (_, i) => ({
  value: `item-${i + 1}`,
  label: `Item ${i + 1}`,
}))
const rows = (prefix: string, count: number) =>
  items
    .slice(0, count)
    .map(
      (item, index) =>
        `<${prefix}-item data-mine value="${item.value}" label="${item.label}" index="${index}">${item.label}</${prefix}-item>`
    )
    .join("")
const count = (root: Element, prefix: string) => {
  const all = [...root.querySelectorAll(`${prefix}-item`)]
  return [all.filter((el) => el.hasAttribute("data-mine")).length, all.length]
}

test("a data combobox keeps the page's rows alone, in a box or written again", async () => {
  document.body.innerHTML = `
    <ui-combobox id="boxed">
      <ui-combobox-input><input aria-label="Boxed" /></ui-combobox-input>
      <ui-combobox-content><ui-combobox-list><div role="presentation">${rows("ui-combobox", 2)}</div></ui-combobox-list></ui-combobox-content>
    </ui-combobox>
    <ui-combobox id="later">
      <ui-combobox-input><input aria-label="Later" /></ui-combobox-input>
      <ui-combobox-content><ui-combobox-list></ui-combobox-list></ui-combobox-content>
    </ui-combobox>`
  type Combobox = HTMLElement & { items: unknown; open: boolean }
  const boxed = document.getElementById("boxed") as Combobox
  const later = document.getElementById("later") as Combobox
  const boxedList = boxed.querySelector("ui-combobox-list")!
  const laterList = later.querySelector("ui-combobox-list")!
  boxed.items = items
  later.items = items
  await wait()
  boxed.open = true
  later.open = true
  await wait(50)
  expect(count(boxedList, "ui-combobox")).toEqual([2, 2])
  expect(count(laterList, "ui-combobox")[1]).toBe(50)
  laterList.insertAdjacentHTML("beforeend", rows("ui-combobox", 2))
  await wait(50)
  expect(count(laterList, "ui-combobox")).toEqual([2, 2])
})

test("a data listbox keeps the page's rows alone", async () => {
  document.body.innerHTML = `<ui-listbox aria-label="Items">${rows("ui-listbox", 3)}</ui-listbox>`
  const listbox = document.querySelector("ui-listbox") as HTMLElement & {
    items: unknown
  }
  listbox.items = items
  await wait(50)
  expect(count(listbox, "ui-listbox")).toEqual([3, 3])
})
