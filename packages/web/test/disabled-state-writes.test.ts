// @vitest-environment jsdom
import { beforeAll, expect, test } from "vitest"
import { defineCheckboxElements, defineSwitchElements } from "../src/checkbox"
import type {
  UiCheckboxElement,
  UiSwitchElement,
  UiToggleElement,
} from "../src/events"
import { defineToggleElements } from "../src/toggle"

// jsdom has no form values, which a checkbox sets.
ElementInternals.prototype.setFormValue ??= () => {}
ElementInternals.prototype.setValidity ??= () => {}

const wait = () => new Promise((resolve) => setTimeout(resolve, 10))

beforeAll(() => {
  defineToggleElements()
  defineCheckboxElements()
  defineSwitchElements()
})

async function mount<Element extends HTMLElement>(html: string) {
  document.body.innerHTML = html
  await wait()
  return document.body.firstElementChild as Element
}

const pressed = (el: HTMLElement) =>
  el.querySelector("button")!.getAttribute("aria-pressed")

test("a disabled toggle takes pressed from its property and attribute, and the two agree once enabled", async () => {
  const toggle = await mount<UiToggleElement>(
    `<ui-toggle disabled><button>X</button></ui-toggle>`
  )
  toggle.setAttribute("pressed", "")
  await wait()
  expect(toggle.pressed).toBe(true)
  expect(pressed(toggle)).toBe("true")
  toggle.removeAttribute("disabled")
  await wait()
  expect(toggle.pressed).toBe(true)
  expect(pressed(toggle)).toBe("true")
  toggle.setAttribute("disabled", "")
  toggle.pressed = false
  await wait()
  expect(pressed(toggle)).toBe("false")
})

test("a disabled toggle still ignores presses", async () => {
  const toggle = await mount<UiToggleElement>(
    `<ui-toggle disabled><button>X</button></ui-toggle>`
  )
  toggle.querySelector("button")!.click()
  await wait()
  expect(toggle.pressed).toBe(false)
})

test("a disabled checkbox takes checked from its property", async () => {
  const checkbox = await mount<UiCheckboxElement>(
    `<ui-checkbox disabled aria-label="Notify me"></ui-checkbox>`
  )
  checkbox.checked = true
  await wait()
  expect(checkbox.checked).toBe(true)
  checkbox.removeAttribute("disabled")
  await wait()
  expect(checkbox.checked).toBe(true)
  checkbox.click()
  await wait()
  expect(checkbox.checked).toBe(false)
})

test("a disabled switch takes checked from its property", async () => {
  const control = await mount<UiSwitchElement>(
    `<ui-switch disabled aria-label="Wi-Fi"><ui-switch-thumb></ui-switch-thumb></ui-switch>`
  )
  control.checked = true
  await wait()
  expect(control.checked).toBe(true)
})
