import { expect, test } from "../fixtures"
import { segment, shown } from "./date-input.helpers"

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const hydrationErrors = (page: import("@playwright/test").Page) =>
  page.evaluate(() => (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors)

test("a date hydrates without mismatches and takes typing", async ({ page, open }) => {
  await open("date-input", { date: "2026-11-02", time: "14:30" })
  await page.waitForLoadState("networkidle")
  expect(await shown(page)).toBe("11/02/2026")
  expect(await shown(page, "time")).toBe("02:30 PM")
  await segment(page, "month").click()
  await page.keyboard.press("ArrowUp")
  expect(await shown(page)).toBe("12/02/2026")
  expect(await hydrationErrors(page)).toEqual([])
})
