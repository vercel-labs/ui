import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// Parts render as any element, through `render` in React, the `render`
// slot in Vue, and `as-child` on web components.

const input = (page: Page) =>
  page.getByRole("combobox", { name: "Search commands" })

test.describe("custom rendering", () => {
  test.beforeEach(async ({ open }) => {
    await open("command-render")
  })

  test("a command rendered as a link keeps its role and follows the link on Enter", async ({
    page,
  }) => {
    await expect(page.getByRole("option", { name: "Docs" })).toHaveAttribute(
      "data-highlighted",
      ""
    )
    await input(page).focus()
    await page.keyboard.press("Enter")
    await expect(page).toHaveURL(/#docs$/)
  })

  test("render functions receive the part's state", async ({
    page,
    framework,
  }) => {
    test.skip(
      framework.startsWith("web"),
      "Web components style state through attributes."
    )
    await input(page).focus()
    await page.keyboard.press("ArrowDown")
    await expect(page.getByRole("option", { name: "Calendar ←" })).toBeVisible()
    await expect(page.getByRole("option", { name: "Calendar ←" })).toHaveClass(
      /is-highlighted/
    )
  })

  test("the root's class names follow its state", async ({
    page,
    framework,
  }) => {
    test.skip(
      framework.startsWith("web"),
      "Web components style state through attributes."
    )
    await expect(page.locator(".command")).toHaveClass(/is-first/)
  })
})
