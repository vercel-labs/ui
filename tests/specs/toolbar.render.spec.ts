import { expect, expectFocus, lastAction, test } from "../fixtures"

// Parts render as any element, through `render` in React, the `render`
// slot in Vue, and the wrapped element on web components.
test.describe("custom rendering", () => {
  test.beforeEach(async ({ open }) => {
    await open("toolbar-render")
  })

  test("a button rendered as a span is still a button and roves", async ({
    page,
    tab,
  }) => {
    const span = page.getByRole("button", { name: "Span tool" })
    expect(await span.evaluate((el) => el.tagName)).toBe("SPAN")
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(span).toBeFocused()
    await page.keyboard.press("Enter")
    expect(await lastAction(page)).toBe("span")
    await page.keyboard.press("ArrowRight")
    await expectFocus(page, "Cut")
  })

  test("a disabled button rendered as a link stays a link, says it's disabled and doesn't navigate", async ({
    page,
  }) => {
    const link = page.getByRole("link", { name: "Old docs" })
    await expect(link).toHaveAttribute("aria-disabled", "true")
    await link.click({ force: true })
    await expect(page).not.toHaveURL(/#old$/)
  })

  test("class names follow the part's state", async ({ page, framework }) => {
    test.skip(
      framework.startsWith("web"),
      "Web components style state through attributes."
    )
    await expect(page.getByRole("link", { name: "Old docs" })).toHaveClass(
      /is-disabled/
    )
  })

  test("a separator rendered as a rule keeps its role and orientation", async ({
    page,
  }) => {
    const rule = page.getByRole("separator")
    expect(await rule.evaluate((el) => el.tagName)).toBe("HR")
    await expect(rule).toHaveAttribute("aria-orientation", "vertical")
  })

  test("moving focus renders only the items whose tab stop moved", async ({
    page,
    framework,
    tab,
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
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await page.keyboard.press("ArrowRight")
    await expectFocus(page, "Cut")
    const before = await renders()
    await page.keyboard.press("ArrowRight")
    await expectFocus(page, "Copy")
    const after = await renders()
    expect(after["Span tool"]).toBe(before["Span tool"])
    expect(after.Copy).toBeGreaterThan(before.Copy)
  })
})
