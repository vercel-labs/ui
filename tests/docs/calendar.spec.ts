import { expect, type Locator } from "@playwright/test"
import { testExamples, type Check } from "./docs-helpers"

// A day by its full date, a gridcell in every framework.
const day = (preview: Locator, name: string) =>
  preview.getByRole("gridcell", { name, exact: true })

const step = (preview: Locator, name: "Previous month" | "Next month") =>
  preview.getByRole("button", { name, exact: true })

async function expectSelected(preview: Locator, name: string, selected = true) {
  await expect(
    day(preview, name),
    `${name} is ${selected ? "" : "not "}selected`
  ).toHaveAttribute("aria-selected", String(selected))
}

async function expectUnavailable(
  preview: Locator,
  name: string,
  unavailable = true
) {
  const cell = day(preview, name)
  if (unavailable) {
    await expect(cell, `${name} can't be picked`).toHaveAttribute(
      "aria-disabled",
      "true"
    )
  } else {
    await expect(cell, `${name} can be picked`).not.toHaveAttribute(
      "aria-disabled",
      "true"
    )
  }
}

// Presses a day and checks it took the selection.
async function pick(preview: Locator, from: string, to: string) {
  await expectSelected(preview, from)
  await day(preview, to).click()
  await expectSelected(preview, to)
  await expectSelected(preview, from, false)
}

// Examples without a value open on today's month. This turns them to a month
// their dates are in, so the checks don't depend on the day the suite runs.
async function showMonth(preview: Locator, month: string) {
  const heading = preview.getByRole("heading")
  const target = Date.parse(month.replace(" ", " 1, "))
  for (let turns = 0; turns < 240; turns++) {
    const shown = (await heading.textContent()) ?? ""
    const time = Date.parse(shown.replace(" ", " 1, "))
    if (time === target) {
      return
    }
    await step(preview, time < target ? "Next month" : "Previous month").click()
    await expect(heading).not.toHaveText(shown)
  }
  throw new Error(`${month} never showed`)
}

// How many days a user can tab to.
const tabStops = (preview: Locator) =>
  preview
    .getByRole("gridcell")
    .evaluateAll(
      (cells) =>
        cells.filter((cell) => (cell as HTMLElement).tabIndex >= 0).length
    )
const checks: Record<string, Check> = {
  basic: async (preview) => {
    await pick(preview, "Friday, October 16, 2026", "Tuesday, October 20, 2026")
    await step(preview, "Next month").click()
    await expect(preview.getByRole("heading")).toHaveText("November 2026")
  },
  range: async (preview) => {
    await expectSelected(preview, "Monday, October 12, 2026")
    await expectSelected(preview, "Wednesday, October 14, 2026")
    await expectSelected(preview, "Friday, October 16, 2026")
    await day(preview, "Tuesday, October 20, 2026").click()
    await day(preview, "Friday, October 23, 2026").click()
    await expectSelected(preview, "Tuesday, October 20, 2026")
    await expectSelected(preview, "Wednesday, October 21, 2026")
    await expectSelected(preview, "Friday, October 23, 2026")
    await expectSelected(preview, "Friday, October 16, 2026", false)
  },
  multiple: async (preview) => {
    await expectSelected(preview, "Wednesday, October 7, 2026")
    await day(preview, "Tuesday, October 20, 2026").click()
    await expectSelected(preview, "Tuesday, October 20, 2026")
    await day(preview, "Wednesday, October 7, 2026").click()
    await expectSelected(preview, "Wednesday, October 7, 2026", false)
  },
  unavailable: async (preview) => {
    await showMonth(preview, "October 2026")
    await expectUnavailable(preview, "Thursday, October 8, 2026")
    await expectUnavailable(preview, "Wednesday, October 21, 2026")
    await expectUnavailable(preview, "Saturday, October 17, 2026")
    await day(preview, "Friday, October 9, 2026").click()
    await expectSelected(preview, "Friday, October 9, 2026")
    await day(preview, "Thursday, October 8, 2026").click({ force: true })
    await expectSelected(preview, "Thursday, October 8, 2026", false)
    await expectSelected(preview, "Friday, October 9, 2026")
  },
  "min-max": async (preview) => {
    await expect(step(preview, "Previous month")).toBeDisabled()
    await expectUnavailable(preview, "Sunday, October 4, 2026")
    await expectUnavailable(preview, "Monday, October 5, 2026", false)
    await step(preview, "Next month").click()
    await expect(preview.getByRole("heading")).toHaveText("November 2026")
    await expectUnavailable(preview, "Friday, November 20, 2026", false)
    await expectUnavailable(preview, "Saturday, November 21, 2026")
    await expect(step(preview, "Next month")).toBeDisabled()
  },
  disabled: async (preview) => {
    expect(await tabStops(preview)).toBe(0)
    await expect(step(preview, "Previous month")).toBeDisabled()
    await expect(step(preview, "Next month")).toBeDisabled()
    await day(preview, "Tuesday, October 20, 2026").click({ force: true })
    await expectSelected(preview, "Friday, October 16, 2026")
    await expectSelected(preview, "Tuesday, October 20, 2026", false)
  },
  "read-only": async (preview) => {
    expect(await tabStops(preview)).toBeGreaterThan(0)
    await day(preview, "Tuesday, October 20, 2026").click()
    await expectSelected(preview, "Friday, October 16, 2026")
    await expectSelected(preview, "Tuesday, October 20, 2026", false)
    await expect(preview.getByRole("grid")).toHaveAttribute(
      "aria-readonly",
      "true"
    )
  },
  "two-months": async (preview) => {
    await expect(
      preview.getByRole("grid", { name: "October 2026" })
    ).toBeVisible()
    await expect(
      preview.getByRole("grid", { name: "November 2026" })
    ).toBeVisible()
    await step(preview, "Next month").click()
    await expect(
      preview.getByRole("grid", { name: "December 2026" })
    ).toBeVisible()
    await expect(
      preview.getByRole("grid", { name: "January 2027" })
    ).toBeVisible()
  },
  "fixed-weeks": async (preview) => {
    // February 2026 fills four weeks, but there are always six, after the weekdays' row.
    await expect(preview.getByRole("heading")).toHaveText("February 2026")
    await expect(preview.getByRole("row")).toHaveCount(7)
    await expect(day(preview, "Saturday, January 31, 2026")).toHaveCount(0)
    await expect(day(preview, "Sunday, March 1, 2026")).toHaveCount(0)
    await step(preview, "Next month").click()
    await expect(preview.getByRole("heading")).toHaveText("March 2026")
    await expect(preview.getByRole("row")).toHaveCount(7)
  },
  "month-year-select": async (preview) => {
    await expect(preview.getByRole("heading")).toHaveText("June 1990")
    await preview.getByRole("combobox", { name: "Year" }).selectOption("1962")
    await preview
      .getByRole("combobox", { name: "Month" })
      .selectOption({ label: "March" })
    await expect(preview.getByRole("heading")).toHaveText("March 1962")
    await expect(
      preview
        .getByRole("combobox", { name: "Year" })
        .getByRole("option")
        .first()
    ).toHaveText("1920")
    await day(preview, "Friday, March 16, 1962").click()
    await expectSelected(preview, "Friday, March 16, 1962")
  },
  "custom-select": async (preview) => {
    await preview.getByRole("combobox", { name: "Year" }).click()
    await preview.page().getByRole("option", { name: "2027" }).click()
    await showMonth(preview, "October 2027")
  },
  locale: async (preview) => {
    await expect(preview.getByRole("heading")).toHaveText("Oktober 2026")
    await expect(
      preview.getByRole("columnheader").first(),
      "the week starts on Monday, and headers read their full names"
    ).toHaveAccessibleName("Montag")
    await pick(
      preview,
      "Freitag, 16. Oktober 2026",
      "Dienstag, 20. Oktober 2026"
    )
  },
  formats: async (preview) => {
    await expect(preview.locator('[data-slot="calendar-heading"]')).toHaveText(
      /^Oct . Nov 2026$/
    )
    await expect(preview.getByRole("columnheader").first()).toHaveText("S")
  },
  "custom-day": async (preview) => {
    await expect(
      day(preview, "Friday, October 16, 2026").getByText("$100")
    ).toBeVisible()
    await expect(
      day(preview, "Sunday, September 27, 2026").getByText("$"),
      "days of the months around it show no price"
    ).toBeHidden()
    await pick(preview, "Friday, October 16, 2026", "Tuesday, October 20, 2026")
  },
  "range-limits": async (preview) => {
    await showMonth(preview, "October 2026")
    await expectUnavailable(preview, "Saturday, October 17, 2026")
    await day(preview, "Thursday, October 15, 2026").click()
    // Until the end is picked, days that would make the stay too short or too long, or
    // end it on a booked day, are disabled.
    await expectUnavailable(preview, "Friday, October 16, 2026")
    await expectUnavailable(preview, "Saturday, October 17, 2026")
    await expectUnavailable(preview, "Monday, October 19, 2026", false)
    await expectUnavailable(preview, "Thursday, October 22, 2026", false)
    await expectUnavailable(preview, "Friday, October 23, 2026")
    await day(preview, "Friday, October 16, 2026").click({ force: true })
    await expect(
      day(preview, "Thursday, October 15, 2026"),
      "a press that would make a stay too short keeps its start"
    ).toHaveAttribute("aria-selected", "true")
    await expectSelected(preview, "Friday, October 16, 2026", false)
    await day(preview, "Tuesday, October 20, 2026").click()
    await expectSelected(preview, "Thursday, October 15, 2026")
    await expect(
      day(preview, "Sunday, October 18, 2026"),
      "the stay may span the booked weekend"
    ).toHaveAttribute("aria-selected", "true")
    await expectSelected(preview, "Tuesday, October 20, 2026")
  },
  "range-progress": async (preview) => {
    const lines = preview
      .locator("xpath=ancestor::figure[1]")
      .locator('section[aria-label="Console"] li:not([aria-hidden])')
    await showMonth(preview, "October 2026")
    await day(preview, "Monday, October 12, 2026").click()
    await expect(
      lines.filter({ hasText: "Started on 2026-10-12" })
    ).toHaveCount(1)
    await preview.page().keyboard.press("ArrowRight")
    await expect(lines.last()).toHaveText("Focus on 2026-10-13")
    await preview.page().keyboard.press("Enter")
    await expectSelected(preview, "Monday, October 12, 2026")
    await expectSelected(preview, "Tuesday, October 13, 2026")
  },
  controlled: async (preview) => {
    await day(preview, "Tuesday, October 20, 2026").click()
    await expect(
      preview
        .locator("xpath=ancestor::figure[1]")
        .locator('section[aria-label="Console"] li:not([aria-hidden])')
        .last()
    ).toHaveText(/^Selected 2026-10-20/)
  },
  "time-zone": async (preview) => {
    // Today is the date in Kiritimati, which can be a day ahead of the browser's.
    const today = new Intl.DateTimeFormat("en-US", {
      timeZone: "Pacific/Kiritimati",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date())
    await expect(preview.locator('[aria-current="date"]')).toHaveCount(1)
    await expect(day(preview, today)).toHaveAttribute("aria-current", "date")
  },
  controller: async (preview) => {
    await expectSelected(preview, "Friday, October 16, 2026")
    await preview.getByRole("button", { name: "Go to Christmas" }).click()
    await expect(preview.getByRole("heading")).toHaveText("December 2026")
    await expectSelected(preview, "Friday, December 25, 2026")
    await expect(day(preview, "Friday, December 25, 2026")).toBeFocused()
    // Today turns back to today's month and selects it.
    await preview.getByRole("button", { name: "Today", exact: true }).click()
    const today = preview.locator('[aria-current="date"]')
    await expect(today).toHaveAttribute("aria-selected", "true")
    await expect(today).toBeFocused()
  },
  presets: async (preview) => {
    await preview.getByRole("button", { name: "Last 7 Days" }).click()
    await expectSelected(preview, "Saturday, October 10, 2026")
    await expectSelected(preview, "Friday, October 16, 2026")
  },
  "custom-grid": async (preview) => {
    await expect(preview.getByRole("grid")).toBeVisible()
  },
}

testExamples("calendar", checks, "components", [...Object.keys(checks), "rtl"])
