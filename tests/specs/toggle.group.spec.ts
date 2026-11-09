import { buttonNamed, expect, groupNamed, lastAction, test } from "../fixtures"

// A set of toggle buttons with one tab stop, moved between with arrow keys
// like the WAI-ARIA toolbar pattern: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/

const pressed = (page: import("@playwright/test").Page, name: string) =>
  expect(buttonNamed(page, name)).toHaveAttribute("aria-pressed", "true")
const unpressed = (page: import("@playwright/test").Page, name: string) =>
  expect(buttonNamed(page, name)).toHaveAttribute("aria-pressed", "false")

test.describe("one pressed at a time", () => {
  test.beforeEach(async ({ open }) => {
    await open("toggle")
  })

  test("the group is named and its default toggle is pressed", async ({
    page,
  }) => {
    await expect(groupNamed(page, "Text alignment")).toBeVisible()
    await pressed(page, "Left")
    await unpressed(page, "Center")
    await unpressed(page, "Right")
  })

  test("pressing a toggle unpresses the others", async ({ page }) => {
    await buttonNamed(page, "Center").click()
    await pressed(page, "Center")
    await unpressed(page, "Left")
    expect(await lastAction(page)).toBe("alignment: center")
  })

  test("pressing the pressed toggle unpresses it", async ({ page }) => {
    await buttonNamed(page, "Left").click()
    await unpressed(page, "Left")
    expect(await lastAction(page)).toBe("alignment: none")
  })

  test("a change can be cancelled", async ({ page, open }) => {
    await open("toggle", { cancel: "right" })
    await buttonNamed(page, "Right").click()
    await unpressed(page, "Right")
    await pressed(page, "Left")
    await buttonNamed(page, "Center").click()
    await pressed(page, "Center")
  })
})

test.describe("several pressed at once", () => {
  test.beforeEach(async ({ open }) => {
    await open("toggle")
  })

  test("pressing toggles adds them to the value", async ({ page }) => {
    await buttonNamed(page, "Italic").click()
    await pressed(page, "Bold")
    await pressed(page, "Italic")
    expect(await lastAction(page)).toBe("formatting: bold, italic")
    await buttonNamed(page, "Bold").click()
    await unpressed(page, "Bold")
    expect(await lastAction(page)).toBe("formatting: italic")
  })

  test("a disabled toggle can't be pressed", async ({ page }) => {
    await buttonNamed(page, "Strikethrough").click({ force: true })
    await unpressed(page, "Strikethrough")
    expect(await lastAction(page)).toBe("")
  })

  test("a disabled group presses nothing", async ({ page, open }) => {
    await open("toggle", { disabled: "" })
    await buttonNamed(page, "Italic").click({ force: true })
    await unpressed(page, "Italic")
    await pressed(page, "Bold")
  })
})

test.describe("keyboard", () => {
  test.beforeEach(async ({ open, page, tab }) => {
    await open("toggle")
    await buttonNamed(page, "Bookmark").focus()
    await tab()
    await expect(buttonNamed(page, "Left")).toBeFocused()
  })

  test("Tab moves into the group once, and out of it", async ({
    page,
    tab,
  }) => {
    await tab()
    await expect(buttonNamed(page, "Bold")).toBeFocused()
    await tab({ shift: true })
    await expect(buttonNamed(page, "Left")).toBeFocused()
  })

  test("only one toggle in a group is a tab stop", async ({ page }) => {
    const stops = groupNamed(page, "Text alignment").locator('[tabindex="0"]')
    await expect(stops).toHaveCount(1)
  })

  test("ArrowRight and ArrowLeft move focus without pressing", async ({
    page,
  }) => {
    await page.keyboard.press("ArrowRight")
    await expect(buttonNamed(page, "Center")).toBeFocused()
    await unpressed(page, "Center")
    await pressed(page, "Left")
    await page.keyboard.press("ArrowLeft")
    await expect(buttonNamed(page, "Left")).toBeFocused()
  })

  test("focus wraps at both ends", async ({ page }) => {
    await page.keyboard.press("ArrowLeft")
    await expect(buttonNamed(page, "Right")).toBeFocused()
    await page.keyboard.press("ArrowRight")
    await expect(buttonNamed(page, "Left")).toBeFocused()
  })

  test("Home and End move to the first and last toggles", async ({ page }) => {
    await page.keyboard.press("End")
    await expect(buttonNamed(page, "Right")).toBeFocused()
    await page.keyboard.press("Home")
    await expect(buttonNamed(page, "Left")).toBeFocused()
  })

  test("ArrowUp and ArrowDown do nothing in a horizontal group", async ({
    page,
  }) => {
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("ArrowUp")
    await expect(buttonNamed(page, "Left")).toBeFocused()
  })

  for (const key of [" ", "Enter"]) {
    test(`${key} presses the focused toggle`, async ({ page }) => {
      await page.keyboard.press("ArrowRight")
      await expect(buttonNamed(page, "Center")).toBeFocused()
      await page.keyboard.press(key)
      await pressed(page, "Center")
      await unpressed(page, "Left")
    })
  }

  test("Tab returns to the toggle focused last", async ({ page, tab }) => {
    await page.keyboard.press("ArrowRight")
    await expect(buttonNamed(page, "Center")).toBeFocused()
    await tab()
    await expect(buttonNamed(page, "Bold")).toBeFocused()
    await tab({ shift: true })
    await expect(buttonNamed(page, "Center")).toBeFocused()
  })

  test("the group itself is never a tab stop", async ({ page }) => {
    await expect(groupNamed(page, "Text alignment")).not.toHaveAttribute(
      "tabindex",
      /.*/
    )
  })

  test("keys pressed without waiting still land", async ({ page }) => {
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press(" ")
    await expect(buttonNamed(page, "Right")).toHaveAttribute(
      "aria-pressed",
      "true"
    )
  })

  test("arrow keys with a modifier are left to the browser", async ({
    page,
  }) => {
    await page.keyboard.press("Alt+ArrowRight")
    await expect(buttonNamed(page, "Left")).toBeFocused()
  })
})

test.describe("options", () => {
  test("with loop off, arrows stop at the ends", async ({ page, open }) => {
    await open("toggle", { loop: "false" })
    await buttonNamed(page, "Left").focus()
    await page.keyboard.press("ArrowLeft")
    await expect(buttonNamed(page, "Left")).toBeFocused()
    await page.keyboard.press("End")
    await page.keyboard.press("ArrowRight")
    await expect(buttonNamed(page, "Right")).toBeFocused()
  })

  test("a vertical group moves with ArrowDown and ArrowUp", async ({
    page,
    open,
  }) => {
    await open("toggle", { orientation: "vertical" })
    await buttonNamed(page, "Left").focus()
    await page.keyboard.press("ArrowRight")
    await expect(buttonNamed(page, "Left")).toBeFocused()
    await page.keyboard.press("ArrowDown")
    await expect(buttonNamed(page, "Center")).toBeFocused()
    await page.keyboard.press("ArrowUp")
    await expect(buttonNamed(page, "Left")).toBeFocused()
  })

  test("the group carries its orientation", async ({ page, open }) => {
    await open("toggle", { orientation: "vertical" })
    await expect(groupNamed(page, "Text alignment")).toHaveAttribute(
      "data-orientation",
      "vertical"
    )
  })
})
