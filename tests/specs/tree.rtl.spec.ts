import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// In a right-to-left page, Left expands and steps in, and Right steps out and collapses.

const item = (page: Page, name: string) =>
  page.getByRole("treeitem", { name, exact: true })

test.beforeEach(async ({ open }) => {
  await open("tree", { dir: "rtl" })
})

test("Left expands a branch, then moves to its first child", async ({
  page,
}) => {
  await item(page, "src").focus()
  await page.keyboard.press("ArrowLeft")
  await expect(item(page, "src")).toHaveAttribute("aria-expanded", "true")
  await page.keyboard.press("ArrowLeft")
  await expect(item(page, "components")).toBeFocused()
})

test("Right moves to the parent, then collapses it", async ({ page }) => {
  await item(page, "src").focus()
  await page.keyboard.press("ArrowLeft")
  await page.keyboard.press("ArrowLeft")
  await expect(item(page, "components")).toBeFocused()
  await page.keyboard.press("ArrowRight")
  await expect(item(page, "src")).toBeFocused()
  await page.keyboard.press("ArrowRight")
  await expect(item(page, "src")).toHaveAttribute("aria-expanded", "false")
})
