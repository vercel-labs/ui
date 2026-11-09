import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// Parts render as any element, through `render` in React, the `render`
// slot in Vue, and `as-child` on web components.

const trigger = (page: Page) => page.getByRole("link", { name: /ui-sdk/ })
const card = (page: Page) => page.getByRole("region", { name: "Repository" })

test.describe("custom rendering", () => {
  test.beforeEach(async ({ open }) => {
    await open("hover-card-render")
  })

  test("content rendered as a section keeps its own role", async ({ page }) => {
    await trigger(page).hover()
    await expect(card(page)).toHaveText("A headless UI kit.")
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
    await trigger(page).hover()
    await expect(trigger(page)).toContainText("▲")
  })

  test("class names follow the part's state", async ({ page, framework }) => {
    test.skip(
      framework.startsWith("web"),
      "Web components style state through attributes."
    )
    await expect(trigger(page)).toHaveClass(/is-closed/)
    await trigger(page).hover()
    await expect(trigger(page)).toHaveClass(/is-open/)
  })
})
