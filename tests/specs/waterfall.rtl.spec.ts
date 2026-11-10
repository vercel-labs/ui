import { expect, test } from "../fixtures"
import { cell, row } from "./waterfall.helpers"

// In a right-to-left page, Left expands and moves into the cells, and Right
// moves back out and collapses.

test.beforeEach(async ({ open }) => {
  await open("waterfall", { dir: "rtl" })
})

test("Left expands a span, then moves into its cells", async ({ page }) => {
  await row(page, "GET /").focus()
  await page.keyboard.press("ArrowLeft")
  await expect(row(page, "GET /")).toHaveAttribute("aria-expanded", "true")
  await page.keyboard.press("ArrowLeft")
  await expect(cell(page, "GET /", 0)).toBeFocused()
  await page.keyboard.press("ArrowLeft")
  await expect(cell(page, "GET /", 1)).toBeFocused()
})

test("Right moves back to the row, then collapses it, then moves to the parent", async ({
  page,
}) => {
  await row(page, "GET /").focus()
  await page.keyboard.press("ArrowLeft")
  await page.keyboard.press("ArrowDown")
  await expect(row(page, "GET /app.css")).toBeFocused()
  await page.keyboard.press("ArrowLeft")
  await expect(cell(page, "GET /app.css", 0)).toBeFocused()
  await page.keyboard.press("ArrowRight")
  await expect(row(page, "GET /app.css")).toBeFocused()
  await page.keyboard.press("ArrowRight")
  await expect(row(page, "GET /")).toBeFocused()
  await page.keyboard.press("ArrowRight")
  await expect(row(page, "GET /")).toHaveAttribute("aria-expanded", "false")
})
