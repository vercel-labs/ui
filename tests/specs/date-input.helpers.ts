import type { Page } from "@playwright/test"
import { dateInputFixture } from "../fixtures/date-input"

const labels = {
  date: dateInputFixture.date.label,
  time: dateInputFixture.time.label,
}

// The group of segments a field's label names.
function group(page: Page, which: "date" | "time" = "date") {
  return page.getByRole("group", { name: labels[which] })
}

// A segment you type in, by its unit, like "month" or "AM/PM".
function segment(
  page: Page,
  unit: string | RegExp,
  which: "date" | "time" = "date"
) {
  return group(page, which).getByRole("spinbutton", { name: unit })
}

// What the group shows: each segment's text, or its placeholder while empty, with the text between them.
async function shown(page: Page, which: "date" | "time" = "date") {
  return group(page, which).evaluate((root) =>
    [...root.children]
      .filter(
        (child) =>
          !(child instanceof HTMLInputElement && child.type === "hidden")
      )
      .map((child) => {
        const input =
          child instanceof HTMLInputElement
            ? child
            : child.querySelector("input")
        return input ? input.value || input.placeholder : child.textContent
      })
      .join("")
      .replace(/\s/g, " ")
  )
}

// Pastes text into whatever has focus, the way the browser's paste does.
async function paste(page: Page, text: string) {
  await page.evaluate((text) => {
    const data = new DataTransfer()
    data.setData("text/plain", text)
    document.activeElement!.dispatchEvent(
      new ClipboardEvent("paste", {
        clipboardData: data,
        bubbles: true,
        cancelable: true,
      })
    )
  }, text)
}

export { group, paste, segment, shown }
