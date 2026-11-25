// @vitest-environment jsdom
import { afterEach, expect, test } from "vitest"
import { defineAutocompleteElements } from "../src/autocomplete"
import type { UiAutocompleteElement } from "../src/events"

const wait = () => new Promise((resolve) => setTimeout(resolve, 10))

afterEach(() => document.body.replaceChildren())

test("an autocomplete's submit reaches the host of the shadow root it renders in", async () => {
  ;(
    Element.prototype as { getAnimations?: () => Animation[] }
  ).getAnimations ??= () => []
  defineAutocompleteElements()
  const host = document.body.appendChild(document.createElement("div"))
  const root = host.attachShadow({ mode: "closed" })
  // jsdom has no adopted style sheets.
  Object.defineProperty(root, "adoptedStyleSheets", {
    value: [],
    writable: true,
  })
  root.innerHTML = `<form><ui-autocomplete><ui-autocomplete-input><input aria-label="Search" /></ui-autocomplete-input></ui-autocomplete></form>`
  await wait()
  let heard: string | undefined
  host.addEventListener(
    "submit",
    (event: Event) => {
      heard = (event as CustomEvent<{ value: string }>).detail.value
      event.preventDefault()
    },
    { capture: true }
  )
  const input = root.querySelector("input")!
  input.value = "kiwi"
  input.dispatchEvent(new InputEvent("input", { bubbles: true }))
  const enter = new KeyboardEvent("keydown", {
    key: "Enter",
    bubbles: true,
    cancelable: true,
  })
  input.dispatchEvent(enter)
  expect(heard).toBe("kiwi")
  expect(enter.defaultPrevented).toBe(true)
})

test("an autocomplete's api highlights a suggestion and says which one is highlighted", async () => {
  ;(
    Element.prototype as { getAnimations?: () => Animation[] }
  ).getAnimations ??= () => []
  defineAutocompleteElements()
  document.body.innerHTML = `<ui-autocomplete><ui-autocomplete-input><input aria-label="Fruit" /></ui-autocomplete-input><ui-autocomplete-content hidden><ui-autocomplete-list><ui-autocomplete-item value="Apple"><ui-autocomplete-item-text>Apple</ui-autocomplete-item-text></ui-autocomplete-item><ui-autocomplete-item value="Banana"><ui-autocomplete-item-text>Banana</ui-autocomplete-item-text></ui-autocomplete-item></ui-autocomplete-list></ui-autocomplete-content></ui-autocomplete>`
  await wait()
  const el = document.querySelector("ui-autocomplete") as UiAutocompleteElement
  el.api.open()
  await wait()
  expect(el.api.highlight("Banana")).toBe(true)
  expect(el.api.getHighlighted()).toBe("Banana")
})
