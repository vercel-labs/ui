import { expect, lastAction, test } from "../fixtures"

// Parts render as any element, through `render` in React, the `render`
// slot in Vue, and the wrapped element on web components. Links
// render as a router's own link component.

const nav = (page: import("@playwright/test").Page) =>
  page.getByRole("navigation", { name: "Results pages" })
const link = (page: import("@playwright/test").Page, name: string) =>
  nav(page).getByRole("link", { name, exact: true })

test.describe("custom rendering", () => {
  test.beforeEach(async ({ open }) => {
    await open("pagination-render")
  })

  test("a router's link keeps its role and current page, and navigates on the client", async ({
    page,
  }) => {
    await expect(link(page, "1")).toHaveAttribute("aria-current", "page")
    await link(page, "3").click()
    await expect(page).toHaveURL(/#results-3$/)
    await expect(link(page, "3")).toHaveAttribute("aria-current", "page")
    expect(await lastAction(page)).toBe("page: 3")
  })

  test("Enter on a router's link goes to its page", async ({ page }) => {
    await link(page, "2").focus()
    await page.keyboard.press("Enter")
    await expect(page).toHaveURL(/#results-2$/)
    await expect(link(page, "2")).toHaveAttribute("aria-current", "page")
  })

  test("a canceled change stops the router too", async ({ page }) => {
    await link(page, "4").click()
    await expect(page).not.toHaveURL(/#results-4$/)
    await expect(link(page, "1")).toHaveAttribute("aria-current", "page")
  })

  test("steps rendered as router links go where they say", async ({ page }) => {
    await expect(link(page, "Previous")).toHaveAttribute(
      "aria-disabled",
      "true"
    )
    await link(page, "Next").click()
    await expect(page).toHaveURL(/#results-2$/)
    await expect(link(page, "2")).toHaveAttribute("aria-current", "page")
  })

  test("render functions and class names follow the part's state", async ({
    page,
    framework,
  }) => {
    test.skip(
      framework.startsWith("web"),
      "Web components style state through attributes."
    )
    await expect(link(page, "1")).toHaveClass(/is-active/)
    await expect(link(page, "1")).toContainText("•")
    await link(page, "2").click()
    await expect(link(page, "1")).toHaveClass(/is-inactive/)
    await expect(link(page, "2")).toContainText("•")
  })
})
