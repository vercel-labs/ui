// @vitest-environment jsdom
// A form state the browser restores before an element's parts bind waits for
// them, but anything newer that sets the state first wins.
import { beforeAll, expect, test, vi } from "vitest"
import { defineCheckboxElements } from "../src/checkbox"
import { defineSelectElements } from "../src/select"

;(Element.prototype as { getAnimations?: () => Animation[] }).getAnimations ??= () => []
ElementInternals.prototype.setFormValue ??= () => {}
ElementInternals.prototype.setValidity ??= () => {}

beforeAll(() => {
  defineCheckboxElements()
  defineSelectElements()
})

// The callback the browser calls as it restores a form, which the element types leave out.
type FormRestore = { formStateRestoreCallback: (state: unknown, mode: string) => void }

const restoreForm = (el: Element, state: string) =>
  (el as Element & FormRestore).formStateRestoreCallback(state, "restore")

// Parts bind a microtask after the element connects, and a waiting restore
// lands right after, so once the root's slot is written both have run.
const bound = (el: Element) => vi.waitFor(() => expect(el.getAttribute("data-slot")).not.toBeNull())

function insert<K extends keyof HTMLElementTagNameMap>(tag: K, markup: string) {
  document.body.innerHTML = `<form>${markup}</form>`
  return document.querySelector(tag)!
}

const checkbox = () =>
  insert("ui-checkbox", `<ui-checkbox name="gift"><button>Gift wrap</button></ui-checkbox>`)

test("a restore before the parts bind lands once they do", async () => {
  const box = checkbox()
  restoreForm(box, "true")
  await bound(box)
  expect(box.checked).toBe(true)
})

test("a script write after a waiting restore wins", async () => {
  const box = checkbox()
  restoreForm(box, "true")
  box.checked = false
  await bound(box)
  expect(box.checked).toBe(false)
})

test("a newer restore wins over an older one still waiting", async () => {
  const box = checkbox()
  restoreForm(box, "true")
  restoreForm(box, "false")
  await bound(box)
  expect(box.checked).toBe(false)
})

type Pet = { id: number }
const pets = [
  { value: { id: 1 }, label: "Cat" },
  { value: { id: 2 }, label: "Dog" },
]
const itemToValue = (item: unknown) => String((item as Pet).id)

test("a restore whose items arrive later fires no valuechange", async () => {
  const select = insert(
    "ui-select",
    `<ui-select name="pet"><ui-select-trigger><button aria-label="Pet"></button></ui-select-trigger></ui-select>`,
  )
  select.itemToValue = itemToValue
  await bound(select)
  const heard: unknown[] = []
  select.addEventListener("valuechange", (event) => heard.push(event.detail.value))
  restoreForm(select, JSON.stringify(["2"]))
  select.items = pets
  await vi.waitFor(() => expect(select.value).toBe(pets[1]!.value))
  expect(heard).toEqual([])
})
