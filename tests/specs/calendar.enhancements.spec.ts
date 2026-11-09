import { test } from "../fixtures"
import { day, expectFocused } from "./calendar.helpers"

// Beyond the WAI-ARIA date picker: behavior other calendars get wrong.

test("keys pressed without waiting still land on the right day @enhancement", async ({
  page,
  open,
}) => {
  await open("calendar")
  await day(page, "2026-10-16").focus()
  for (const key of [
    "PageDown",
    "PageDown",
    "ArrowRight",
    "ArrowDown",
    "PageUp",
  ]) {
    await page.keyboard.press(key)
  }
  await expectFocused(page, "2026-11-24")
})

test("a day of next month takes focus even when its month renders after the key @enhancement", async ({
  page,
  open,
}) => {
  await open("calendar", { value: "2026-10-31" })
  await day(page, "2026-10-31").focus()
  await page.keyboard.press("ArrowDown")
  await expectFocused(page, "2026-11-07")
  await page.keyboard.press("ArrowUp")
  await expectFocused(page, "2026-10-31")
})
