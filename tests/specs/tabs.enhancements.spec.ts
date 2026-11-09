import { expect, panelNamed, tabNamed, test } from "../fixtures"

// Behavior past the WAI-ARIA pattern, tagged `@enhancement`.

test.describe("enhancements", { tag: "@enhancement" }, () => {
  test("in manual mode, re-entering the tab list focuses the selected tab", async ({
    page,
    open,
    tab,
  }) => {
    await open("tabs", { activation: "manual" })
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await page.keyboard.press("ArrowRight")
    await expect(tabNamed(page, "Password")).toBeFocused()
    await tab()
    await expect(panelNamed(page, "Account")).toBeFocused()
    await tab({ shift: true })
    await expect(tabNamed(page, "Account")).toBeFocused()
  })

  test("a panel that holds a field is not a tab stop of its own", async ({
    page,
    open,
    tab,
  }) => {
    await open("tabs")
    await tabNamed(page, "Password").click()
    await tabNamed(page, "Password").focus()
    await tab()
    await expect(
      page.getByRole("textbox", { name: "Current password" })
    ).toBeFocused()
  })

  test("a controller selects a tab from anywhere", async ({ page, open }) => {
    await open("tabs")
    await page.getByRole("button", { name: "Show notifications" }).click()
    await expect(tabNamed(page, "Notifications")).toHaveAttribute(
      "aria-selected",
      "true"
    )
    await expect(panelNamed(page, "Notifications")).toBeVisible()
  })

  test("an infinite exit animation still unmounts the panel", async ({
    page,
    open,
  }) => {
    await open("tabs", { animate: "infinite" })
    await tabNamed(page, "Password").click()
    await expect(panelNamed(page, "Password")).toBeVisible()
    await expect(page.locator('[role="tabpanel"]:not([hidden])')).toHaveCount(1)
  })
})
