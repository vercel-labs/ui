import { expect, lastAction, tabNamed, test } from "../fixtures"

// Parts render as any element, through `render` in React, the `render`
// slot in Vue, and `as-child` on web components.
test.describe("custom rendering", () => {
  test.beforeEach(async ({ open }) => {
    await open("tabs-render")
  })

  test("a tab rendered as a link is still a tab, and the keyboard follows it", async ({
    page,
    tab,
  }) => {
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(tabNamed(page, "Overview")).toBeFocused()
    await page.keyboard.press("ArrowRight")
    const activity = tabNamed(page, "Activity")
    await expect(activity).toBeFocused()
    expect(await activity.evaluate((el) => el.tagName)).toBe("A")
    await expect(activity).toHaveAttribute("aria-selected", "true")
    expect(await lastAction(page)).toBe("activity")
    await expect(page).toHaveURL(/#activity$/)
  })

  test("an arrow key to a tab rendered as a link reports list navigation", async ({
    page,
    tab,
  }) => {
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await page.keyboard.press("ArrowRight")
    await expect(page.getByRole("status", { name: "Reason" })).toHaveText(
      "list-navigation"
    )
    await tabNamed(page, "Overview").click()
    await expect(page.getByRole("status", { name: "Reason" })).toHaveText(
      "item-press"
    )
  })

  test("Space prevented by an earlier handler doesn't select a link tab", async ({
    page,
    open,
    tab,
  }) => {
    await open("tabs-render", { activation: "manual" })
    await page.evaluate(() =>
      document.addEventListener(
        "keydown",
        (event) => event.key === " " && event.preventDefault(),
        true
      )
    )
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press(" ")
    await expect(tabNamed(page, "Activity")).toHaveAttribute(
      "aria-selected",
      "false"
    )
    await expect(page).not.toHaveURL(/#activity$/)
  })

  test("clicking a tab rendered as a link follows it", async ({ page }) => {
    await tabNamed(page, "Activity").click()
    await expect(tabNamed(page, "Activity")).toHaveAttribute(
      "aria-selected",
      "true"
    )
    await expect(page).toHaveURL(/#activity$/)
  })

  test("Space selects a tab rendered as a link in manual mode", async ({
    page,
    open,
    tab,
  }) => {
    await open("tabs-render", { activation: "manual" })
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await page.keyboard.press("ArrowRight")
    await expect(tabNamed(page, "Activity")).toBeFocused()
    await expect(page).not.toHaveURL(/#activity$/)
    await page.keyboard.press(" ")
    await expect(tabNamed(page, "Activity")).toHaveAttribute(
      "aria-selected",
      "true"
    )
    await expect(page).toHaveURL(/#activity$/)
  })

  test("render functions receive the part's state", async ({
    page,
    framework,
  }) => {
    test.skip(
      framework.startsWith("web"),
      "Web components style state through attributes."
    )
    const watched = tabNamed(page, "Watched")
    await expect(watched).not.toContainText("•")
    await watched.click()
    await expect(watched).toContainText("•")
    await tabNamed(page, "Overview").click()
    await expect(watched).not.toContainText("•")
  })

  test("class names follow the part's state", async ({ page, framework }) => {
    test.skip(
      framework.startsWith("web"),
      "Web components style state through attributes."
    )
    const plain = tabNamed(page, "Plain")
    await expect(
      plain.locator("css=:scope, *").and(page.locator(".is-unselected"))
    ).toHaveCount(1)
    await plain.click()
    await expect(
      plain.locator("css=:scope, *").and(page.locator(".is-selected"))
    ).toHaveCount(1)
  })
})
