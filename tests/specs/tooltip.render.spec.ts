import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// Parts render as any element, through `render` in React, the `render`
// slot in Vue, and the wrapped element on web components.

const docs = (page: Page) => page.getByRole("link", { name: "Docs" })
const status = (page: Page) => page.getByRole("button", { name: /Status/ })

test.describe("custom rendering", () => {
  test.beforeEach(async ({ open }) => {
    await open("tooltip-render")
  })

  test("a trigger rendered as a link shows its tooltip and Enter follows the link", async ({
    page,
    tab,
  }) => {
    await docs(page).hover()
    await expect(page.getByRole("tooltip")).toHaveText("Read the docs")
    await page.mouse.move(0, 0)
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(docs(page)).toBeFocused()
    await expect(page.getByRole("tooltip")).toHaveText("Read the docs")
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
    await expect(status(page)).toContainText("○")
    await status(page).hover()
    await expect(status(page)).toContainText("●")
  })

  test("class names follow the part's state", async ({ page, framework }) => {
    test.skip(
      framework.startsWith("web"),
      "Web components style state through attributes."
    )
    await expect(status(page)).toHaveClass(/is-closed/)
    await status(page).hover()
    await expect(status(page)).toHaveClass(/is-open/)
    await expect(page.getByRole("tooltip")).toHaveClass(/is-open/)
  })
})
