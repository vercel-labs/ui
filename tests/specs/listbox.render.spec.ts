import { expect, lastAction, test } from "../fixtures"

// Parts render as any element, through `render` in React, the `render`
// slot in Vue, and `as-child` on web components.

const list = (page: import("@playwright/test").Page) =>
  page.getByRole("listbox", { name: "Toppings" })
const option = (page: import("@playwright/test").Page, name: string) =>
  page.getByRole("option", { name })

test.describe("custom rendering", () => {
  test.beforeEach(async ({ open }) => {
    await open("listbox-render")
  })

  test("an option rendered as a link keeps its role, follows the link with Enter and is chosen", async ({
    page,
    tab,
  }) => {
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    const docs = option(page, "Docs")
    await expect(docs).toBeFocused()
    expect(await docs.evaluate((el) => el.tagName)).toBe("A")
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("ArrowUp")
    await page.keyboard.press("Enter")
    await expect(page).toHaveURL(/#docs$/)
    await expect(docs).toHaveAttribute("aria-selected", "true")
  })

  test("a press on an option rendered as a link follows it", async ({
    page,
  }) => {
    await option(page, "Docs").click()
    await expect(page).toHaveURL(/#docs$/)
    expect(await lastAction(page)).toBe("value:docs")
  })

  test("the listbox and options keep their roles as other elements", async ({
    page,
    framework,
  }) => {
    test.skip(
      framework.startsWith("web"),
      "Web components are their own elements."
    )
    expect(await list(page).evaluate((el) => el.tagName)).toBe("UL")
    expect(await option(page, "Basil").evaluate((el) => el.tagName)).toBe("LI")
  })

  test("render functions and class names receive the part's state", async ({
    page,
    framework,
  }) => {
    test.skip(
      framework.startsWith("web"),
      "Web components style state through attributes."
    )
    const star = option(page, "Star")
    await expect(star).toContainText("☆")
    await expect(star).toHaveClass(/is-unselected/)
    await star.click()
    await expect(star).toContainText("★")
    await expect(star).toHaveClass(/is-selected/)
  })

  test("moving focus renders only the options whose tab stop moved", async ({
    page,
    framework,
  }) => {
    test.skip(
      !framework.startsWith("react"),
      "Only React parts render by the state they read."
    )
    const renders = () =>
      page.evaluate(() => ({
        ...(window as unknown as { __renders: Record<string, number> })
          .__renders,
      }))
    await option(page, "Basil").focus()
    const before = await renders()
    await page.keyboard.press("ArrowDown")
    await expect(option(page, "Cheese")).toBeFocused()
    const after = await renders()
    expect(after.Garlic).toBe(before.Garlic)
    expect(after.Cheese).toBeGreaterThan(before.Cheese)
  })
})
