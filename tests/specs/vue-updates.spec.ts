import { expect, test } from "../fixtures"

// Vue parts follow values that change after mount, where `setup` would
// otherwise read them once: props passed down through `provide`, `attrs`
// and composable options.
test.beforeEach(async ({ open }) => {
  await open("vue-updates")
})

test("a standalone item's remove button follows the item's new file", async ({
  page,
}) => {
  await expect(
    page.getByRole("button", { name: "Remove first.png" })
  ).toBeVisible()
  await page.getByRole("button", { name: "Next file" }).click()
  await expect(
    page.getByRole("button", { name: "Remove second.png" })
  ).toBeVisible()
})

test("a navigation menu trigger follows its item's new value", async ({
  page,
}) => {
  const trigger = page.getByRole("button", { name: "Products" })
  await expect(trigger).toHaveAttribute("id", /trigger-products$/)
  await page.getByRole("button", { name: "Rename item" }).click()
  await expect(trigger).toHaveAttribute("id", /trigger-catalog$/)
  await trigger.click()
  await expect(page.getByText("Every product")).toBeVisible()
})

test("a toast region follows a new aria-label", async ({ page }) => {
  await page.getByRole("button", { name: "Show toast" }).click()
  await expect(
    page.getByRole("region", { name: "Notifications" })
  ).toBeVisible()
  await page.getByRole("button", { name: "Rename region" }).click()
  await expect(page.getByRole("region", { name: "Alerts" })).toBeVisible()
})

test("a shortcut registers again when its options change", async ({ page }) => {
  const presses = page.getByRole("status", { name: "Presses" })
  await page.getByRole("textbox", { name: "Search" }).focus()
  await page.keyboard.press("k")
  await expect(presses).toHaveText("0")
  await page.getByRole("button", { name: "Arm shortcut" }).click()
  await page.getByRole("textbox", { name: "Search" }).focus()
  await page.keyboard.press("k")
  await expect(presses).toHaveText("1")
})
