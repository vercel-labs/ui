import { expect } from "@playwright/test"
import { test } from "../docs-test"
import { openExamples } from "./behaviors/helpers"

test("every example renders without errors", async ({ page }) => {
  const { errors } = await openExamples(page, "/docs/behaviors/date")
  await expect(page.locator("[data-example]")).toHaveCount(8)
  await expect(page.locator("figure > figcaption")).toHaveCount(8)
  expect(errors).toEqual([])
})

test("values: real dates build, February 30 doesn't, and a picked date comes apart", async ({ page }) => {
  await openExamples(page, "/docs/behaviors/date")
  await expect(page.locator("[data-built]")).toHaveText("No such day")
  await page.getByLabel("Day", { exact: true }).fill("28")
  await expect(page.locator("[data-built]")).toHaveText("2026-02-28")
  await expect(page.locator("[data-parts]")).toHaveText("year 2026, month 10, day 16")
  await page.getByLabel("Picked date").fill("2028-02-29")
  await expect(page.locator("[data-parts]")).toHaveText("year 2028, month 2, day 29")
  await page.getByRole("button", { name: "Today" }).click()
  const today = await page.evaluate(() => {
    const now = new Date()
    return `year ${now.getFullYear()}, month ${now.getMonth() + 1}, day ${now.getDate()}`
  })
  await expect(page.locator("[data-parts]")).toHaveText(today)
})

test("days: check-out and the weekday follow, and a date outside the season moves into it", async ({
  page,
}) => {
  await openExamples(page, "/docs/behaviors/date")
  await expect(page.locator("[data-check-in]")).toHaveText("Thursday, 2026-12-24")
  await expect(page.locator("[data-check-out]")).toHaveText("Sunday, 2026-12-27")
  await expect(page.locator("[data-away]")).toHaveText("69 days after Oct 16")
  await page.getByLabel("Nights").fill("10")
  await expect(page.locator("[data-check-out]")).toHaveText("Sunday, 2027-01-03")
  await page.getByLabel("Check-in").fill("2026-10-20")
  await expect(page.locator("[data-check-in]")).toHaveText("Sunday, 2026-11-01 (moved into the season)")
})

test("months: a month on from January 31 is February 28, and the week follows its first day", async ({
  page,
}) => {
  await openExamples(page, "/docs/behaviors/date")
  const date = page.locator("[data-date]")
  await expect(page.locator("[data-this-month]").first()).toHaveText("2026-01-01 to 2026-01-31, 31 days")
  await page.getByRole("button", { name: "+ Month" }).click()
  await expect(date).toHaveText("2026-02-28")
  await expect(page.locator("[data-this-week]")).toHaveText("2026-02-23 to 2026-03-01, across two months")
  await page.getByRole("combobox", { name: "Weeks start on" }).selectOption("0")
  await expect(page.locator("[data-this-week]")).toHaveText("2026-02-22 to 2026-02-28")
  await page.getByRole("button", { name: "Reset", exact: true }).click()
  await page.getByRole("button", { name: "+ Year" }).click()
  await page.getByRole("button", { name: "+ Year" }).click()
  await expect(date).toHaveText("2028-01-31")
  await page.getByRole("button", { name: "+ Month" }).click()
  await expect(date).toHaveText("2028-02-29")
  await expect(page.locator("[data-this-month]").first()).toHaveText("2028-02-01 to 2028-02-29, 29 days")
})

test("month sizes: six weeks each line up, and without them February 2026 takes four", async ({ page }) => {
  await openExamples(page, "/docs/behaviors/date")
  const weeks = (month: string) => page.locator(`[data-month="${month}"] [data-week]`)
  await expect(weeks("2026-02-01")).toHaveCount(6)
  await expect(weeks("2026-08-01")).toHaveCount(6)
  await page.getByRole("checkbox", { name: "Six weeks each" }).uncheck()
  await expect(weeks("2026-02-01")).toHaveCount(4)
  await expect(weeks("2026-03-01")).toHaveCount(5)
  await expect(weeks("2026-08-01")).toHaveCount(6)
})

test("locale: names, ranges and the first day follow the locale, and Persian keeps Gregorian months", async ({
  page,
}) => {
  await openExamples(page, "/docs/behaviors/date")
  const locale = page.getByRole("combobox", { name: "Locale" }).nth(1)
  await expect(page.locator("[data-long]")).toHaveText("Friday, October 16, 2026")
  await expect(page.locator("[data-range]")).toHaveText("Oct 16 – 20, 2026")
  await expect(page.locator("[data-weekdays]")).toHaveText("Sun Mon Tue Wed Thu Fri Sat")
  await expect(page.locator('[data-label] [data-type="day"]')).toHaveText("16")
  await locale.selectOption("en-US-u-fw-mon")
  await expect(page.locator("[data-weekdays]")).toHaveText("Mon Tue Wed Thu Fri Sat Sun")
  await locale.selectOption("de-DE")
  await expect(page.locator("[data-long]")).toHaveText("Freitag, 16. Oktober 2026")
  await expect(page.locator("[data-weekdays]")).toHaveText(/^Mo\.? Di/)
  await locale.selectOption("fa-IR")
  await expect(page.locator("[data-calendar]")).toHaveText("gregory")
})

test("today: each city shows its own date", async ({ page }) => {
  await openExamples(page, "/docs/behaviors/date")
  for (const zone of ["Asia/Tokyo", "America/Los_Angeles"]) {
    const expected = await page.evaluate(
      (timeZone) => new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone }).format(new Date()),
      zone,
    )
    await expect(page.locator(`[data-zone="${zone}"]`)).toHaveText(expected)
  }
  await expect(page.locator('[data-zone="here"]')).toHaveText(/^\d{4}-\d\d-\d\d$/)
})

test("parse: typed text reads in the locale's order, and a two-digit year follows the reference", async ({
  page,
}) => {
  await openExamples(page, "/docs/behaviors/date")
  const input = page.getByRole("textbox", { name: "Date", exact: true })
  const parsed = page.locator("[data-parsed]")
  await expect(parsed).toHaveText("2026-10-16, Friday, October 16, 2026")
  await expect(input).toHaveAttribute("placeholder", "MM/DD/YYYY")
  await expect(page.locator("[data-pattern]")).toHaveText("month / day / year")
  await input.fill("Feb 30")
  await expect(parsed).toHaveText(/^Type a date, like 12\/31\/\d{4}$/)
  await page.getByRole("combobox", { name: "Locale" }).last().selectOption("de-DE")
  await expect(input).toHaveAttribute("placeholder", "TT.MM.JJJJ")
  await input.fill("16 10 70")
  await expect(parsed).toHaveText(/^1970-10-16/)
  await page.getByLabel("Reference date").fill("2060-01-01")
  await expect(parsed).toHaveText(/^2070-10-16/)
})

test("the date lookup links to each focused example", async ({ page }) => {
  await openExamples(page, "/docs/behaviors/date")
  const lookup = page.getByRole("main").getByRole("table")
  const links = lookup.getByRole("link")
  await expect(links).toHaveCount(7)
  for (const link of await links.all()) {
    const href = (await link.getAttribute("href"))!
    await expect(page.locator(`[id="${href.slice(1)}"]`)).toHaveCount(1)
  }
})
