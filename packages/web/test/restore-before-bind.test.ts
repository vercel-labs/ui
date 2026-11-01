// @vitest-environment jsdom
// A form state the browser restores before an element's parts bind waits for
// them, but anything newer that sets the state first wins.
import { beforeAll, expect, test } from "vitest"
import { defineCheckboxElements } from "../src/checkbox"
import type { UiCheckboxElement, UiSelectElement } from "../src/events"
import { defineSelectElements } from "../src/select"

;(Element.prototype as { getAnimations?: () => Animation[] }).getAnimations ??= () => []
ElementInternals.prototype.setFormValue ??= () => {}
ElementInternals.prototype.setValidity ??= () => {}

const wait = () => new Promise((resolve) => setTimeout(resolve, 10))

beforeAll(() => {
  defineCheckboxElements()
  defineSelectElements()
})

// The callback the browser calls as it restores a form, which the element type leaves out.
type Checkbox = UiCheckboxElement & { formStateRestoreCallback: (state: unknown, mode: string) => void }

function insert() {
  document.body.innerHTML = `<form><ui-checkbox name="gift"><button>Gift wrap</button></ui-checkbox></form>`
  return { box: document.querySelector("ui-checkbox")! as Checkbox }
}

test("a restore before the parts bind lands once they do", async () => {
  const { box } = insert()
  box.formStateRestoreCallback("true", "restore")
  await wait()
  expect(box.checked).toBe(true)
})

test("a script write after a waiting restore wins", async () => {
  const { box } = insert()
  box.formStateRestoreCallback("true", "restore")
  box.checked = false
  await wait()
  expect(box.checked).toBe(false)
})

test("a newer restore wins over an older one still waiting", async () => {
  const { box } = insert()
  box.formStateRestoreCallback("true", "restore")
  box.formStateRestoreCallback("false", "restore")
  await wait()
  expect(box.checked).toBe(false)
})

test("a restore whose items arrive later fires no valuechange", async () => {
  document.body.innerHTML = `<form><ui-select name="pet"><ui-select-trigger><button aria-label="Pet"></button></ui-select-trigger></ui-select></form>`
  const select = document.querySelector("ui-select")! as UiSelectElement & {
    formStateRestoreCallback: (state: unknown, mode: string) => void
  }
  const items = [
    { value: { id: 1 }, label: "Cat" },
    { value: { id: 2 }, label: "Dog" },
  ]
  select.itemToValue = (item) => String((item as { id: number }).id)
  await wait()
  const heard: unknown[] = []
  select.addEventListener("valuechange", (event) => heard.push(event.detail.value))
  select.formStateRestoreCallback(JSON.stringify(["2"]), "restore")
  await wait()
  select.items = items
  await wait()
  expect(select.value).toBe(items[1]!.value)
  expect(heard).toEqual([])
})
