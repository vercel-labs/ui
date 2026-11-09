import { expect, type Page } from "@playwright/test"

// A date's accessible name, as a day reads in English: "Friday, October 16, 2026".
function dateName(date: string) {
  const [year, month, day] = date.split("-").map(Number) as [
    number,
    number,
    number,
  ]
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(Date.UTC(year, month - 1, day))
}

const day = (page: Page, date: string) =>
  page.getByRole("gridcell", { name: dateName(date), exact: true })

const heading = (page: Page) => page.getByRole("heading")

const status = (page: Page) => page.getByRole("status", { name: "Last action" })

// Waits for focus to land on a date.
const expectFocused = (page: Page, date: string) =>
  expect(day(page, date)).toBeFocused()

// The dates that are tab stops, by name.
const stops = (page: Page) =>
  page
    .locator('[role="gridcell"][tabindex="0"]')
    .evaluateAll((cells) => cells.map((cell) => cell.ariaLabel))

// The selected dates, by name.
const selected = (page: Page) =>
  page
    .locator('[role="gridcell"][aria-selected="true"]')
    .evaluateAll((cells) => cells.map((cell) => cell.ariaLabel))

export { dateName, day, expectFocused, heading, selected, status, stops }
