import { buttonNamed, expect, lastAction, test } from "../fixtures"

// Parts render as any element, through `render` in React, the `render`
// slot in Vue, and the wrapped element on web components.
test.describe("custom rendering", () => {
  test.beforeEach(async ({ open }) => {
    await open("toggle-render")
  })

  test("a button rendered as a span is still a button", async ({ page }) => {
    const span = buttonNamed(page, "Span button")
    expect(await span.evaluate((el) => el.tagName)).toBe("SPAN")
    await span.click()
    expect(await lastAction(page)).toBe("span")
  })

  for (const key of [" ", "Enter"]) {
    test(`${key} presses a button rendered as a span`, async ({
      page,
      tab,
    }) => {
      await page.getByRole("button", { name: "Before" }).focus()
      await tab()
      await expect(buttonNamed(page, "Span button")).toBeFocused()
      await page.keyboard.press(key)
      expect(await lastAction(page)).toBe("span")
    })
  }

  test("a disabled link says so and doesn't navigate", async ({ page }) => {
    const link = page.getByRole("link", { name: "Old docs" })
    await expect(link).toHaveAttribute("aria-disabled", "true")
    await link.click({ force: true })
    await expect(page).not.toHaveURL(/#old$/)
  })

  test("render functions receive the part's state", async ({
    page,
    framework,
  }) => {
    test.skip(
      framework.startsWith("web"),
      "Web components style state through attributes."
    )
    const star = buttonNamed(page, "Star")
    await expect(star).toContainText("☆")
    await star.click()
    await expect(star).toContainText("★")
    expect(await lastAction(page)).toBe("star")
  })

  test("class names follow the part's state", async ({ page, framework }) => {
    test.skip(
      framework.startsWith("web"),
      "Web components style state through attributes."
    )
    const star = buttonNamed(page, "Star")
    await expect(star).toHaveClass(/is-unpressed/)
    await star.click()
    await expect(star).toHaveClass(/is-pressed/)
  })

  test("toggles rendered as spans are toggle buttons with roving focus", async ({
    page,
  }) => {
    const grid = buttonNamed(page, "Grid")
    await expect(grid).toHaveAttribute("aria-pressed", "true")
    await grid.focus()
    await page.keyboard.press("ArrowRight")
    await expect(buttonNamed(page, "List")).toBeFocused()
    await page.keyboard.press(" ")
    await expect(buttonNamed(page, "List")).toHaveAttribute(
      "aria-pressed",
      "true"
    )
    expect(await lastAction(page)).toBe("list")
  })

  test("a separator rendered as a rule keeps its role", async ({ page }) => {
    const rule = page.getByRole("separator")
    expect(await rule.evaluate((el) => el.tagName)).toBe("HR")
  })
})
