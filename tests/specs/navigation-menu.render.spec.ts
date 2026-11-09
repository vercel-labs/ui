import type { Page } from "@playwright/test"
import { expect, lastAction, test } from "../fixtures"

// Parts render as any element, through `render` in React, the `render`
// slot in Vue, and `as-child` on web components. Links render as a
// router's own link component.

const trigger = (page: Page) => page.getByRole("button", { name: /Guides/ })
const panel = (page: Page) => page.getByRole("region", { name: "Guides panel" })

test.describe("custom rendering", () => {
  test.beforeEach(async ({ open }) => {
    await open("navigation-menu-render")
  })

  test("content rendered as a section keeps its own role", async ({ page }) => {
    await trigger(page).click()
    await expect(panel(page)).toContainText("Install")
  })

  test("a router's link keeps its role and current page, and navigates on the client", async ({
    page,
  }) => {
    await trigger(page).click()
    await expect(
      page.getByRole("link", { name: "Introduction" })
    ).toHaveAttribute("aria-current", "page")
    await page.getByRole("link", { name: "Install" }).click()
    await expect(page).toHaveURL(/#install$/)
  })

  test("a router's link that prevents the page load still closes the menu", async ({
    page,
  }) => {
    await trigger(page).click()
    await page.getByRole("link", { name: "Install" }).click()
    await expect(panel(page)).toBeHidden()
    expect(await lastAction(page)).toBe("close: link-press")
  })

  test("render functions receive the part's state", async ({
    page,
    framework,
  }) => {
    test.skip(
      framework.startsWith("web"),
      "Web components style state through attributes."
    )
    await expect(trigger(page)).toContainText("▼")
    await trigger(page).click()
    await expect(trigger(page)).toContainText("▲")
  })

  test("class names follow the part's state", async ({ page, framework }) => {
    test.skip(
      framework.startsWith("web"),
      "Web components style state through attributes."
    )
    await expect(trigger(page)).toHaveClass(/is-closed/)
    await trigger(page).click()
    await expect(trigger(page)).toHaveClass(/is-open/)
  })
})
