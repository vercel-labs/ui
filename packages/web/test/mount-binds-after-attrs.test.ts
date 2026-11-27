// @vitest-environment jsdom
import { afterEach, beforeAll, expect, test, vi } from "vitest"
import { defineButtonElements } from "../src/button"
import { defineColorPickerElements } from "../src/color-picker"

beforeAll(() => {
  ;(
    Element.prototype as { getAnimations?: () => Animation[] }
  ).getAnimations ??= () => []
  ElementInternals.prototype.setFormValue ??= () => {}
  ElementInternals.prototype.setValidity ??= () => {}
  defineButtonElements()
  defineColorPickerElements()
})

afterEach(() => {
  vi.restoreAllMocks()
  document.body.replaceChildren()
})

test("parts written together have their attributes before any of them reads a style", async () => {
  const unbound: string[] = []
  const read = window.getComputedStyle
  vi.spyOn(window, "getComputedStyle").mockImplementation((el, pseudo) => {
    const button = document.querySelector("button")
    if (button && !button.hasAttribute("data-slot")) {
      unbound.push("button")
    }
    return read(el, pseudo)
  })
  document.body.innerHTML = `<ui-color-picker></ui-color-picker><ui-button><button>After</button></ui-button>`
  await new Promise((resolve) => setTimeout(resolve, 10))
  expect(document.querySelector("button")!.getAttribute("data-slot")).toBe(
    "button"
  )
  expect(unbound).toEqual([])
})
