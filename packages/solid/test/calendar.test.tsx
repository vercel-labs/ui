import { render } from "@solidjs/web"
import { flush } from "solid-js"
import { afterEach, expect, test, vi } from "vitest"
import { Calendar, CalendarGrid, CalendarNext } from "../src/calendar"

let dispose = () => {}

afterEach(() => {
  dispose()
  document.body.replaceChildren()
  vi.restoreAllMocks()
})

test("a week the next month shows too keeps its own part", async () => {
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
  const root = document.body.appendChild(document.createElement("div"))
  dispose = render(
    () => (
      <Calendar locale="en-US" defaultMonth="2026-11">
        <CalendarNext>Next</CalendarNext>
        <CalendarGrid />
      </Calendar>
    ),
    root
  )
  flush()
  await new Promise((resolve) => setTimeout(resolve))
  root.querySelector<HTMLElement>("[data-slot=calendar-next]")!.click()
  flush()
  await new Promise((resolve) => setTimeout(resolve))
  expect(warn.mock.calls.flat().join("\n")).not.toContain("share the key")
})
