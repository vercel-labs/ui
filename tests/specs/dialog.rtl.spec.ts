import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// A dialog has no direction of its own. In right-to-left layouts, focus,
// Tab order and dismissal work the same.

const dialog = (page: Page) =>
  page.getByRole("dialog", { name: "Profile settings" })
const trigger = (page: Page) =>
  page.getByRole("button", { name: "Edit profile" })

test("the dialog opens, traps Tab and closes in a right-to-left layout", async ({
  page,
  open,
  tab,
}) => {
  await open("dialog", { dir: "rtl" })
  await trigger(page).focus()
  await page.keyboard.press("Enter")
  await expect(
    page.getByRole("textbox", { name: "Display name" })
  ).toBeFocused()
  await tab({ shift: true })
  await expect(page.getByRole("button", { name: "Close" })).toBeFocused()
  await page.keyboard.press("Escape")
  await expect(dialog(page)).toBeHidden()
  await expect(trigger(page)).toBeFocused()
})

test("pressing the backdrop closes the dialog in a right-to-left layout", async ({
  page,
  open,
}) => {
  await open("dialog", { dir: "rtl" })
  await trigger(page).click()
  await expect(dialog(page)).toBeVisible()
  const width = page.viewportSize()!.width
  await page.mouse.click(width - 5, 5)
  await expect(dialog(page)).toBeHidden()
})
