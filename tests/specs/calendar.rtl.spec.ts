import { expect, test } from "../fixtures"
import { calendarFixture as f } from "../fixtures/calendar"
import { day, expectFocused, heading } from "./calendar.helpers"

// Right-to-left pages lay the week out from the right, so Left moves to the next day.

test("Left and Right swap in a right-to-left page", async ({ page, open }) => {
  await open("calendar", { dir: "rtl" })
  await day(page, f.today).focus()
  await page.keyboard.press("ArrowLeft")
  await expectFocused(page, "2026-10-17")
  await page.keyboard.press("ArrowRight")
  await page.keyboard.press("ArrowRight")
  await expectFocused(page, "2026-10-15")
})

test("the first day of the week sits on the right in a right-to-left page", async ({
  page,
  open,
}) => {
  await open("calendar", { dir: "rtl" })
  const first = await day(page, "2026-10-11").boundingBox()
  const second = await day(page, "2026-10-12").boundingBox()
  expect(first!.x).toBeGreaterThan(second!.x)
  await expect(heading(page)).toHaveText("October 2026")
})

test("moving past the month's edge in a right-to-left page shows the next month", async ({
  page,
  open,
}) => {
  await open("calendar", { dir: "rtl", value: "2026-10-31" })
  await day(page, "2026-10-31").focus()
  await page.keyboard.press("ArrowLeft")
  await expectFocused(page, "2026-11-01")
  await expect(heading(page)).toHaveText("November 2026")
})
