// @vitest-environment jsdom
// jsdom never calls formDisabledCallback, so a control's own `disabled` has
// to come and go through the attribute alone.
import { beforeAll, expect, test } from "vitest"
import { defineCheckboxElements, defineSwitchElements } from "../src/checkbox"

const wait = () => new Promise((resolve) => setTimeout(resolve, 10))

beforeAll(() => {
  ElementInternals.prototype.setFormValue ??= () => {}
  ElementInternals.prototype.setValidity ??= () => {}
  defineSwitchElements()
  defineCheckboxElements()
})

test.each(["ui-switch", "ui-checkbox"])(
  "a %s that starts disabled works once it's enabled",
  async (tag) => {
    document.body.innerHTML = `<${tag} disabled aria-label="Wi-Fi"></${tag}>`
    const el = document.querySelector(tag) as HTMLElement & {
      disabled: boolean
      checked: boolean
    }
    await wait()
    el.disabled = false
    await wait()
    expect(el.hasAttribute("aria-disabled")).toBe(false)
    expect(el.hasAttribute("data-disabled")).toBe(false)
    el.click()
    await wait()
    expect(el.checked).toBe(true)
  }
)

test("a switch in a disabled fieldset stays disabled", async () => {
  document.body.innerHTML = `<fieldset disabled><ui-switch aria-label="Wi-Fi"></ui-switch></fieldset>`
  const el = document.querySelector("ui-switch") as HTMLElement & {
    checked: boolean
  }
  await wait()
  expect(el.getAttribute("aria-disabled")).toBe("true")
  el.click()
  await wait()
  expect(el.checked).toBe(false)
})
