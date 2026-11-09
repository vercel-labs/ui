import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// Parts render as any element, through `render` in React, the `render`
// slot in Vue, and `as-child` on web components.

const trigger = (page: Page) => page.getByRole("combobox", { name: "Fruit" })

test.describe("custom rendering", () => {
  test.beforeEach(async ({ open }) => {
    await open("select-render")
  })

  test("an item rendered as a link keeps its role, follows the link and is chosen", async ({
    page,
  }) => {
    await trigger(page).focus()
    await page.keyboard.press("Enter")
    const docs = page.getByRole("option", { name: "Docs" })
    await expect(docs).toBeFocused()
    await page.keyboard.press("Enter")
    await expect(page).toHaveURL(/#docs$/)
    await expect(page.getByRole("listbox")).toBeHidden()
    await expect(trigger(page)).toContainText("Docs")
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
