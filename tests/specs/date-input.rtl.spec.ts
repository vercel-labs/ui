import { expect, test } from "../fixtures"
import { segment } from "./date-input.helpers"

// Right to left, the arrows follow the layout.

test("ArrowLeft moves to the next segment", async ({ page, open }) => {
  await open("date-input", { dir: "rtl", date: "2026-11-02" })
  await segment(page, "month").click()
  await page.keyboard.press("ArrowLeft")
  await expect(segment(page, "day")).toBeFocused()
  await page.keyboard.press("ArrowRight")
  await expect(segment(page, "month")).toBeFocused()
})

test("typing still fills the segments in order", async ({ page, open }) => {
  await open("date-input", { dir: "rtl" })
  await segment(page, "month").click()
  await page.keyboard.type("11042026")
  await expect(segment(page, "year")).toHaveValue("2026")
})
