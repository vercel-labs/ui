// @vitest-environment jsdom
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, expect, test } from "vitest"
import {
  CalendarGrid,
  DatePicker,
  DatePickerContent,
  DatePickerInput,
  DatePickerTrigger,
} from "../src/date-picker"

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
Element.prototype.getAnimations ??= () => []
Element.prototype.scrollIntoView ??= () => {}
HTMLElement.prototype.showPopover ??= function () {}
HTMLElement.prototype.hidePopover ??= function () {}
// jsdom has no top layer, and won't focus inside a popover it thinks is hidden.
document.head.insertAdjacentHTML(
  "beforeend",
  "<style>[popover][data-open] { display: block !important }</style>"
)

let root: Root | undefined
afterEach(async () => {
  await act(async () => root?.unmount())
  root = undefined
  document.body.replaceChildren()
})

const settle = () =>
  act(
    () =>
      new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve)))
  )

const focusedDate = () =>
  (document.activeElement as HTMLElement).getAttribute("data-value")

async function render(value?: string) {
  const container = document.body.appendChild(document.createElement("div"))
  root = createRoot(container)
  await act(async () =>
    root!.render(
      <DatePicker today="2026-01-10" defaultValue={value}>
        <DatePickerInput aria-label="Date" />
        <DatePickerTrigger />
        <DatePickerContent>
          <CalendarGrid />
        </DatePickerContent>
      </DatePicker>
    )
  )
  await settle()
  return container.querySelector<HTMLElement>(
    "[data-slot=date-picker-trigger]"
  )!
}

async function press(key: string) {
  const el = document.activeElement as HTMLElement
  await act(async () => {
    el.dispatchEvent(
      new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true })
    )
  })
  await settle()
}

async function open(trigger: HTMLElement) {
  trigger.focus()
  await act(async () => {
    trigger.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
        cancelable: true,
      })
    )
    trigger.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 0 }))
  })
  await settle()
  return focusedDate()
}

test.each([
  [
    "no value, within the month",
    undefined,
    ["ArrowLeft", "ArrowLeft"],
    "2026-01-08",
    "2026-01-10",
  ],
  [
    "no value, into another month",
    undefined,
    ["ArrowLeft", "PageUp"],
    "2025-12-09",
    "2026-01-10",
  ],
  [
    "a value, into another month",
    "2025-10-05",
    ["PageUp", "ArrowLeft"],
    "2025-09-04",
    "2025-10-05",
  ],
] as const)(
  "%s: browsing then Escape reopens on the selected date or today",
  async (_, value, keys, browsed, reopened) => {
    const trigger = await render(value)
    expect(await open(trigger)).toBe(reopened)
    for (const key of keys) {
      await press(key)
    }
    expect(focusedDate()).toBe(browsed)
    await press("Escape")
    expect(await open(trigger)).toBe(reopened)
    expect(
      document.querySelector("[role=grid]")!.getAttribute("aria-label")
    ).toBe(
      new Date(`${reopened}T00:00`).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    )
  }
)
