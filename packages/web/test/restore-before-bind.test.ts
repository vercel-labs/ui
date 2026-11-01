// @vitest-environment jsdom
// A form state the browser restores before an element's parts bind waits for
// them, but anything newer that sets the state first wins.
import { beforeAll, expect, test } from "vitest"
import { defineCheckboxElements } from "../src/checkbox"

;(Element.prototype as { getAnimations?: () => Animation[] }).getAnimations ??= () => []
ElementInternals.prototype.setFormValue ??= () => {}
ElementInternals.prototype.setValidity ??= () => {}

const wait = () => new Promise((resolve) => setTimeout(resolve, 10))

beforeAll(() => defineCheckboxElements())

type Checkbox = HTMLElement & {
  checked: boolean | "indeterminate"
  formStateRestoreCallback: (state: unknown, mode: string) => void
}

function insert() {
  document.body.innerHTML = `<form><ui-checkbox name="gift"><button>Gift wrap</button></ui-checkbox></form>`
  return { box: document.querySelector("ui-checkbox") as Checkbox }
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
