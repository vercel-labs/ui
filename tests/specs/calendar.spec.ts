import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"
import { calendarAction, calendarFixture as f } from "../fixtures/calendar"
import { dateName, day, expectFocused, heading, selected, status, stops } from "./calendar.helpers"

// A grid of days with one tab stop, following the WAI-ARIA date picker
// dialog's grid: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/

test("the calendar shows a month as a grid of days under weekday headers", async ({ page, open }) => {
  await open("calendar")
  await expect(heading(page)).toHaveText("October 2026")
  const grid = page.getByRole("grid", { name: "October 2026" })
  await expect(grid).toBeVisible()
  await expect(grid.getByRole("columnheader")).toHaveText(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"])
  await expect(grid.getByRole("columnheader").first()).toHaveAccessibleName("Sunday")
  await expect(day(page, "2026-10-16")).toHaveText("16")
  await expect(day(page, f.today)).toHaveAttribute("aria-current", "date")
})

test("the selected date holds the tab stop, else today", async ({ page, open, tab }) => {
  await open("calendar", { value: "2026-10-20" })
  expect(await stops(page)).toEqual([dateName("2026-10-20")])
  await page.getByRole("button", { name: f.next }).focus()
  await tab()
  await expectFocused(page, "2026-10-20")
  await open("calendar")
  expect(await stops(page)).toEqual([dateName(f.today)])
})

test("Tab leaves the grid after one stop", async ({ page, open, tab }) => {
  await open("calendar")
  await day(page, f.today).focus()
  await tab()
  await expect(page.getByRole("button", { name: f.controller.label })).toBeFocused()
  await tab({ shift: true })
  await expectFocused(page, f.today)
})

test("arrow keys move focus by day and week", async ({ page, open }) => {
  await open("calendar")
  await day(page, "2026-10-16").focus()
  await page.keyboard.press("ArrowRight")
  await expectFocused(page, "2026-10-17")
  await page.keyboard.press("ArrowDown")
  await expectFocused(page, "2026-10-24")
  await page.keyboard.press("ArrowLeft")
  await expectFocused(page, "2026-10-23")
  await page.keyboard.press("ArrowUp")
  await expectFocused(page, "2026-10-16")
  expect(await stops(page)).toEqual([dateName("2026-10-16")])
})

test("moving past the month's edge shows the next month and focuses the day there", async ({
  page,
  open,
}) => {
  await open("calendar", { value: "2026-10-31" })
  await day(page, "2026-10-31").focus()
  await page.keyboard.press("ArrowRight")
  await expectFocused(page, "2026-11-01")
  await expect(heading(page)).toHaveText("November 2026")
  await expect(status(page)).toHaveText(calendarAction("month", "2026-11", "list-navigation"))
  await page.keyboard.press("ArrowUp")
  await expectFocused(page, "2026-10-25")
  await expect(heading(page)).toHaveText("October 2026")
})

test("Page Up and Page Down move by month, and with Shift by year", async ({ page, open }) => {
  await open("calendar")
  await day(page, "2026-10-16").focus()
  await page.keyboard.press("PageDown")
  await expectFocused(page, "2026-11-16")
  await page.keyboard.press("Shift+PageDown")
  await expectFocused(page, "2027-11-16")
  await page.keyboard.press("PageUp")
  await expectFocused(page, "2027-10-16")
  await page.keyboard.press("Shift+PageUp")
  await expectFocused(page, "2026-10-16")
})

test("the day of the month stays the same, or the month's last, when moving by month", async ({
  page,
  open,
}) => {
  await open("calendar", { value: "2027-01-31", month: "2027-01" })
  await day(page, "2027-01-31").focus()
  await page.keyboard.press("PageDown")
  await expectFocused(page, "2027-02-28")
})

test("Home and End go to the first and last day of the week", async ({ page, open }) => {
  await open("calendar")
  await day(page, "2026-10-14").focus()
  await page.keyboard.press("Home")
  await expectFocused(page, "2026-10-11")
  await page.keyboard.press("End")
  await expectFocused(page, "2026-10-17")
})

test("the week starts on the locale's first day", async ({ page, open }) => {
  await open("calendar", { lang: "de-DE" })
  const grid = page.getByRole("grid")
  await expect(grid.getByRole("columnheader")).toHaveText(["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"])
  await expect(heading(page)).toHaveText("Oktober 2026")
})

test("pressing a day selects it", async ({ page, open }) => {
  await open("calendar")
  await day(page, "2026-10-20").click()
  await expect(status(page)).toHaveText(calendarAction("value", "2026-10-20", "item-press"))
  expect(await selected(page)).toEqual([dateName("2026-10-20")])
  await expectFocused(page, "2026-10-20")
})

for (const key of ["Enter", " "])
  test(`${key === " " ? "Space" : key} on a focused day selects it`, async ({ page, open }) => {
    await open("calendar")
    await day(page, "2026-10-16").focus()
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press(key)
    await expect(status(page)).toHaveText(calendarAction("value", "2026-10-17", "item-press"))
  })

test("Previous and Next show the month before and after, and the heading announces it", async ({
  page,
  open,
}) => {
  await open("calendar")
  await expect(heading(page)).toHaveAttribute("aria-live", "polite")
  await page.getByRole("button", { name: f.next }).click()
  await expect(heading(page)).toHaveText("November 2026")
  await expect(status(page)).toHaveText(calendarAction("month", "2026-11", "next-press"))
  await page.getByRole("button", { name: f.previous }).click()
  await page.getByRole("button", { name: f.previous }).click()
  await expect(heading(page)).toHaveText("September 2026")
  await expect(status(page)).toHaveText(calendarAction("month", "2026-09", "previous-press"))
  // The grid keeps one tab stop in the month shown.
  expect(await stops(page)).toEqual([dateName("2026-09-01")])
})

test("min and max stop keys there, and Previous and Next at their months", async ({ page, open }) => {
  await open("calendar", { min: "2026-10-10", max: "2026-10-20", value: "2026-10-12" })
  await expect(page.getByRole("button", { name: f.previous })).toHaveAttribute("aria-disabled", "true")
  await expect(page.getByRole("button", { name: f.next })).toHaveAttribute("aria-disabled", "true")
  await expect(day(page, "2026-10-09")).toHaveAttribute("aria-disabled", "true")
  await day(page, "2026-10-12").focus()
  await page.keyboard.press("ArrowUp")
  await expectFocused(page, "2026-10-10")
  await page.keyboard.press("PageDown")
  await expectFocused(page, "2026-10-20")
  await day(page, "2026-10-21").click({ force: true })
  await expect(status(page)).toHaveText("")
})

test("unavailable dates can be focused but not selected", async ({ page, open }) => {
  await open("calendar", { unavailable: "weekends" })
  await expect(day(page, "2026-10-17")).toHaveAttribute("aria-disabled", "true")
  await day(page, "2026-10-16").focus()
  await page.keyboard.press("ArrowRight")
  await expectFocused(page, "2026-10-17")
  await page.keyboard.press("Enter")
  // Playwright waits for an aria-disabled element to be enabled, so it forces the press.
  await day(page, "2026-10-18").click({ force: true })
  await expect(status(page)).toHaveText("")
})

test("in multiple mode, presses toggle dates", async ({ page, open }) => {
  await open("calendar", { mode: "multiple" })
  await expect(page.getByRole("grid")).toHaveAttribute("aria-multiselectable", "true")
  await day(page, "2026-10-20").click()
  await day(page, "2026-10-02").click()
  await expect(status(page)).toHaveText(calendarAction("value", ["2026-10-02", "2026-10-20"], "item-press"))
  await day(page, "2026-10-20").click()
  await expect(status(page)).toHaveText(calendarAction("value", ["2026-10-02"], "item-press"))
})

test("in range mode, two presses pick a range, previewed in between", async ({ page, open }) => {
  await open("calendar", { mode: "range" })
  await day(page, "2026-10-16").click()
  await day(page, "2026-10-19").hover()
  await expect(day(page, "2026-10-17")).toHaveAttribute("data-range-middle", "")
  await expect(status(page)).toHaveText("")
  await day(page, "2026-10-19").click()
  await expect(status(page)).toHaveText(calendarAction("value", ["2026-10-16", "2026-10-19"], "item-press"))
  expect(await selected(page)).toEqual(["2026-10-16", "2026-10-17", "2026-10-18", "2026-10-19"].map(dateName))
})

test("in range mode, keys preview the end and Escape drops the start", async ({ page, open }) => {
  await open("calendar", { mode: "range", value: "2026-10-05,2026-10-07" })
  await day(page, "2026-10-05").focus()
  await page.keyboard.press("ArrowDown")
  await page.keyboard.press("Enter")
  await page.keyboard.press("ArrowRight")
  await page.keyboard.press("ArrowRight")
  await expect(day(page, "2026-10-13")).toHaveAttribute("data-range-middle", "")
  await page.keyboard.press("Escape")
  expect(await selected(page)).toEqual(["2026-10-05", "2026-10-06", "2026-10-07"].map(dateName))
  await page.keyboard.press("Enter")
  await page.keyboard.press("ArrowDown")
  await page.keyboard.press("Enter")
  await expect(status(page)).toHaveText(calendarAction("value", ["2026-10-14", "2026-10-21"], "item-press"))
})

test("a range keeps to its fewest and most days, and keeps its start", async ({ page, open }) => {
  await open("calendar", { mode: "range", minDays: "3", maxDays: "5" })
  await day(page, "2026-10-12").click()
  await day(page, "2026-10-13").click()
  await expect(status(page)).toHaveText("")
  await day(page, "2026-10-19").click()
  await expect(status(page)).toHaveText("")
  await day(page, "2026-10-15").click()
  await expect(status(page)).toHaveText(calendarAction("value", ["2026-10-12", "2026-10-15"], "item-press"))
})

test("two months show side by side, and focus moves between them without turning", async ({ page, open }) => {
  await open("calendar", { months: "2" })
  await expect(heading(page)).toHaveText(/October\s–\sNovember 2026/)
  await expect(page.getByRole("grid")).toHaveCount(2)
  await day(page, "2026-10-31").focus()
  await page.keyboard.press("ArrowRight")
  await expectFocused(page, "2026-11-01")
  await expect(heading(page)).toHaveText(/October\s–\sNovember 2026/)
  await page.keyboard.press("PageDown")
  await expectFocused(page, "2026-12-01")
  await expect(heading(page)).toHaveText(/November\s–\sDecember 2026/)
})

test("pressing a day of the next month selects it and shows its month", async ({ page, open }) => {
  await open("calendar", { month: "2026-09" })
  await page.locator('[data-slot="calendar-day"][data-outside]', { hasText: /^1$/ }).last().click()
  await expect(status(page)).toHaveText(calendarAction("month", "2026-10", "item-press"))
  await expect(heading(page)).toHaveText("October 2026")
  await expectFocused(page, "2026-10-01")
  expect(await selected(page)).toEqual([dateName("2026-10-01")])
})

test("pressing another month's day before min keeps the month shown", async ({ page, open }) => {
  await open("calendar", { min: "2026-10-01" })
  const before = page.locator('[data-slot="calendar-day"][data-outside]', { hasText: /^28$/ }).first()
  await expect(before).toHaveAttribute("aria-disabled", "true")
  await before.click({ force: true })
  await expect(heading(page)).toHaveText("October 2026")
  await expect(status(page)).toHaveText("")
})

test("pressing another month's day before min leaves focus on the day that had it", async ({
  page,
  open,
}) => {
  await open("calendar", { min: "2026-10-01" })
  await day(page, "2026-10-16").focus()
  await page
    .locator('[data-slot="calendar-day"][data-outside]', { hasText: /^28$/ })
    .first()
    .click({ force: true })
  await expect(heading(page)).toHaveText("October 2026")
  await expectFocused(page, "2026-10-16")
  await page.keyboard.press("ArrowRight")
  await expectFocused(page, "2026-10-17")
})

test("a controlled calendar shows what the app passes", async ({ page, open }) => {
  await open("calendar", { controlled: "", value: "2026-10-31" })
  await day(page, "2026-10-31").focus()
  await page.keyboard.press("ArrowRight")
  await expectFocused(page, "2026-11-01")
  await page.keyboard.press("Enter")
  await expect(status(page)).toHaveText(calendarAction("value", "2026-11-01", "item-press"))
  expect(await selected(page)).toEqual([dateName("2026-11-01")])
})

test("a controller turns to a date and focuses it", async ({ page, open }) => {
  await open("calendar")
  await page.getByRole("button", { name: f.controller.label }).click()
  await expect(heading(page)).toHaveText("January 2027")
  await expectFocused(page, f.controller.date)
})

test("a disabled calendar has no tab stop and selects nothing", async ({ page, open }) => {
  await open("calendar", { disabled: "" })
  expect(await stops(page)).toEqual([])
  await day(page, "2026-10-20").click({ force: true })
  await expect(status(page)).toHaveText("")
  await expect(page.getByRole("button", { name: f.next })).toHaveAttribute("aria-disabled", "true")
})

test("a read-only calendar moves focus but selects nothing", async ({ page, open }) => {
  await open("calendar", { readonly: "" })
  await expect(page.getByRole("grid")).toHaveAttribute("aria-readonly", "true")
  await day(page, f.today).focus()
  await page.keyboard.press("ArrowRight")
  await page.keyboard.press("Enter")
  await expectFocused(page, "2026-10-17")
  await expect(status(page)).toHaveText("")
})

test.describe("month and year selects", () => {
  const month = (page: Page) => page.getByRole("combobox", { name: "Month" })
  const year = (page: Page) => page.getByRole("combobox", { name: "Year" })

  test("they show the first month shown and turn the calendar, with the select-change reason", async ({
    page,
    open,
  }) => {
    await open("calendar", { selects: "" })
    await expect(month(page)).toHaveValue("10")
    await expect(year(page)).toHaveValue("2026")
    await month(page).selectOption({ label: "February" })
    await expect(heading(page)).toHaveText("February 2026")
    await expect(status(page)).toHaveText(calendarAction("month", "2026-02", "select-change"))
    await year(page).selectOption("2018")
    await expect(heading(page)).toHaveText("February 2018")
    await expect(month(page)).toHaveValue("2")
    // The selects follow Previous and Next.
    await page.getByRole("button", { name: f.next }).click()
    await expect(month(page)).toHaveValue("3")
  })

  test("years run from min to max, and months past them are disabled", async ({ page, open }) => {
    await open("calendar", { selects: "", min: "2024-03-10", max: "2026-11-02" })
    await expect(year(page).getByRole("option")).toHaveText(["2024", "2025", "2026"])
    await expect(month(page).getByRole("option", { name: "December" })).toBeDisabled()
    await year(page).selectOption("2024")
    // October 2024 is in range; February 2024 would be before min.
    await expect(heading(page)).toHaveText("October 2024")
    await month(page).selectOption({ label: "March" })
    await expect(heading(page)).toHaveText("March 2024")
  })

  test("they follow the page's language", async ({ page, open }) => {
    await open("calendar", { selects: "", lang: "de" })
    await expect(month(page).getByRole("option", { selected: true })).toHaveText("Oktober")
  })
})
