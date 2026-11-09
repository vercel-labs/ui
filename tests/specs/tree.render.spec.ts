import type { Page } from "@playwright/test"
import { expect, lastAction, test } from "../fixtures"

// Items whose label is a link: a docs sidebar, with the current page marked.

const item = (page: Page, name: string) =>
  page.getByRole("treeitem", { name, exact: true })

test.beforeEach(async ({ open }) => {
  await open("tree-links")
})

test("the current page's item is marked, and its branch starts expanded", async ({
  page,
}) => {
  await expect(item(page, "Usage")).toHaveAttribute("aria-current", "page")
  await expect(item(page, "Getting started")).toHaveAttribute(
    "aria-expanded",
    "true"
  )
  await expect(item(page, "Usage")).not.toHaveAttribute("aria-selected")
})

test("Tab lands on the current page's item, and links stay out of the tab order", async ({
  page,
  tab,
}) => {
  await page.getByRole("button", { name: "Before" }).focus()
  await tab()
  await expect(item(page, "Usage")).toBeFocused()
  await tab()
  await expect(page.getByRole("button", { name: "After" })).toBeFocused()
})

test("Enter follows the item's link", async ({ page }) => {
  await item(page, "Usage").focus()
  await page.keyboard.press("ArrowUp")
  await expect(item(page, "Installation")).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(page).toHaveURL(/#installation$/)
  await expect.poll(() => lastAction(page)).toBe("installation")
  await expect(item(page, "Installation")).toHaveAttribute(
    "aria-current",
    "page"
  )
})

test("clicking a link follows it and focuses its item", async ({ page }) => {
  await item(page, "Components").click()
  await item(page, "Tree").getByRole("link").click()
  await expect(page).toHaveURL(/#tree$/)
  await expect(item(page, "Tree")).toBeFocused()
  await expect(item(page, "Tree")).toHaveAttribute("aria-current", "page")
})
