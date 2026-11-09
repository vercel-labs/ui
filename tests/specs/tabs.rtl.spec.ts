import { coversTab, expect, panelNamed, tabNamed, test } from "../fixtures"

// Right-to-left layouts mirror the horizontal arrows.

test.beforeEach(async ({ open }) => {
  await open("tabs", { dir: "rtl" })
})

test("ArrowLeft moves to the next tab and ArrowRight to the previous one", async ({
  page,
  tab,
}) => {
  await page.getByRole("button", { name: "Before" }).focus()
  await tab()
  await expect(tabNamed(page, "Account")).toBeFocused()
  await page.keyboard.press("ArrowLeft")
  await expect(tabNamed(page, "Password")).toBeFocused()
  await expect(panelNamed(page, "Password")).toBeVisible()
  await page.keyboard.press("ArrowRight")
  await expect(tabNamed(page, "Account")).toBeFocused()
})

test("the indicator covers the selected tab", async ({ page }) => {
  await tabNamed(page, "Notifications").click()
  await expect.poll(() => coversTab(page, "Notifications")).toBe(true)
})

test("the activation direction follows the screen", async ({ page }) => {
  await tabNamed(page, "Notifications").click()
  await expect(page.getByRole("tablist")).toHaveAttribute(
    "data-activation-direction",
    "left"
  )
})
