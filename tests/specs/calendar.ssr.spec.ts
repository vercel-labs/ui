import { expect, test } from "../fixtures"
import { calendarFixture as f } from "../fixtures/calendar"
import {
  dateName,
  day,
  expectFocused,
  heading,
  stops,
} from "./calendar.helpers"

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const hydrationErrors = (page: import("@playwright/test").Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors
  )

test("a calendar hydrates without mismatches, with one tab stop", async ({
  page,
  open,
}) => {
  await open("calendar", { value: "2026-10-20" })
  await page.waitForLoadState("networkidle")
  expect(await stops(page)).toEqual([dateName("2026-10-20")])
  await day(page, "2026-10-20").focus()
  await page.keyboard.press("PageDown")
  await expectFocused(page, "2026-11-20")
  expect(await hydrationErrors(page)).toEqual([])
})

// The heading names the range, which the server's ICU spaces differently than the browser's.
test("a calendar showing two months hydrates without mismatches", async ({
  page,
  open,
}) => {
  await open("calendar", { months: "2" })
  await page.waitForLoadState("networkidle")
  expect(await hydrationErrors(page)).toEqual([])
})

test("a calendar in another language hydrates and then reads the page's language", async ({
  page,
  open,
}) => {
  await open("calendar", { lang: "de-DE" })
  await expect(heading(page)).toHaveText("Oktober 2026")
  await expect(day(page, f.today)).toHaveCount(0)
  expect(await hydrationErrors(page)).toEqual([])
})
