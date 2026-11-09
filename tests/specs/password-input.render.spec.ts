import { buttonNamed, expect, lastAction, test } from "../fixtures"

// Parts render as any element, through `render` in React, the `render` slot in
// Vue, and the wrapped element on web components.
test.describe("custom rendering", () => {
  test.beforeEach(async ({ open }) => {
    await open("password-input-render")
  })

  const field = (page: import("@playwright/test").Page) =>
    page.getByLabel("Password", { exact: true })

  test("a toggle rendered as a span is still a toggle button", async ({
    page,
  }) => {
    const toggle = buttonNamed(page, "Show password")
    expect(await toggle.evaluate((el) => el.tagName)).toBe("SPAN")
    await expect(toggle).toHaveAttribute("aria-pressed", "false")
    await toggle.click()
    await expect(field(page)).toHaveAttribute("type", "text")
    await expect(toggle).toHaveAttribute("aria-pressed", "true")
    expect(await lastAction(page)).toBe("visible: true")
  })

  for (const key of [" ", "Enter"]) {
    test(`${key === " " ? "Space" : key} presses a toggle rendered as a span`, async ({
      page,
      tab,
    }) => {
      await field(page).focus()
      await tab()
      await expect(buttonNamed(page, "Show password")).toBeFocused()
      await page.keyboard.press(key)
      await expect(field(page)).toHaveAttribute("type", "text")
    })
  }

  test("render functions and class names follow whether the password shows", async ({
    page,
    framework,
  }) => {
    test.skip(
      framework.startsWith("web"),
      "Web components style state through attributes."
    )
    const toggle = buttonNamed(page, "Show password")
    await expect(toggle).toHaveClass(/is-hidden/)
    await expect(toggle).toContainText("Show")
    await toggle.click()
    await expect(toggle).toHaveClass(/is-visible/)
    await expect(toggle).toContainText("Hide")
  })

  test("web components mark state on the wrapped element", async ({
    page,
    framework,
  }) => {
    test.skip(!framework.startsWith("web"), "Only web components.")
    const toggle = buttonNamed(page, "Show password")
    await toggle.click()
    await expect(toggle).toHaveAttribute("data-visible", "")
  })
})
