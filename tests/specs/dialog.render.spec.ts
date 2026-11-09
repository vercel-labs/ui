import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// Parts render as any element, through `render` in React, the `render`
// slot in Vue, and `as-child` on web components.

const trigger = (page: Page) => page.getByRole("button", { name: "Shipping" })
const dialog = (page: Page) => page.getByRole("dialog", { name: "Shipping" })

test.describe("custom rendering", () => {
  test.beforeEach(async ({ open }) => {
    await open("dialog-render")
  })

  test("a title rendered as another heading still names the dialog", async ({
    page,
  }) => {
    await trigger(page).click()
    await expect(dialog(page)).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Shipping", level: 3 })
    ).toBeVisible()
  })

  test("a description rendered as another element still describes the dialog", async ({
    page,
  }) => {
    await trigger(page).click()
    await expect(dialog(page)).toHaveAccessibleDescription(
      "Arrives in two days."
    )
  })

  test("a close button rendered as a link follows it, closes the dialog and returns focus", async ({
    page,
  }) => {
    await trigger(page).focus()
    await page.keyboard.press("Enter")
    const done = page.getByRole("link", { name: "Done" })
    await expect(done).toBeFocused()
    await page.keyboard.press("Enter")
    await expect(dialog(page)).toBeHidden()
    await expect(page).toHaveURL(/#done$/)
    await expect(trigger(page)).toBeFocused()
  })

  test("a backdrop rendered as another element still closes the dialog when pressed", async ({
    page,
  }) => {
    await trigger(page).click()
    await expect(dialog(page)).toBeVisible()
    await page.mouse.click(5, 5)
    await expect(dialog(page)).toBeHidden()
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
    await expect(page.locator(".is-open")).not.toHaveCount(1)
  })
})
