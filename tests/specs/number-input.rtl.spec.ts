import { expect, test } from "../fixtures"
import { amount, quantity } from "./number-input.helpers"

// Right to left, numbers keep their keys: Up increases, Down decreases.

test("ArrowUp increases it and ArrowDown decreases it", async ({
  page,
  open,
}) => {
  await open("number-input", { dir: "rtl" })
  await quantity(page).focus()
  await page.keyboard.press("ArrowUp")
  await expect(quantity(page)).toHaveValue("2")
  await page.keyboard.press("ArrowDown")
  await expect(quantity(page)).toHaveValue("1")
})

test("formatted values read the same right to left", async ({ page, open }) => {
  await open("number-input", { dir: "rtl" })
  await expect(amount(page)).toHaveValue("$1,234.50")
})
