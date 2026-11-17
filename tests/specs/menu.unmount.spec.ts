import { expect, test } from "../fixtures"

// A controlled menu whose content the app renders only while it's open, with
// an entrance animation that fills forwards.

test("a menu whose content renders only while open opens again after each close", async ({
  open,
  page,
}) => {
  await open("menu-unmount")
  const trigger = page.getByRole("button", { name: "Actions" })
  const menu = page.getByRole("menu")
  for (const close of [
    () => trigger.click(),
    () => page.keyboard.press("Escape"),
    () => page.getByRole("menuitem", { name: "Rename" }).click(),
  ]) {
    await trigger.click()
    await expect(menu).toBeVisible()
    await close()
    await expect(menu).toBeHidden()
  }
  await trigger.click()
  await expect(menu).toBeVisible()
})
