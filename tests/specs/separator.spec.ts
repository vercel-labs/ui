import { expect, test } from "../fixtures"

// The separator role: https://www.w3.org/TR/wai-aria-1.2/#separator

test.beforeEach(async ({ open }) => {
  await open("toggle")
})

test("a separator is announced with its orientation", async ({ page }) => {
  const separators = page.getByRole("separator")
  await expect(separators).toHaveCount(2)
  await expect(separators.first()).toHaveAttribute(
    "aria-orientation",
    "vertical"
  )
  await expect(separators.last()).not.toHaveAttribute(
    "aria-orientation",
    "vertical"
  )
})

test("a separator can't be focused", async ({ page }) => {
  for (const separator of await page.getByRole("separator").all()) {
    await expect(separator).not.toHaveAttribute("tabindex", /.*/)
  }
})

test("a separator carries its orientation for styling", async ({ page }) => {
  await expect(page.getByRole("separator").first()).toHaveAttribute(
    "data-orientation",
    "vertical"
  )
  await expect(page.getByRole("separator").last()).toHaveAttribute(
    "data-orientation",
    "horizontal"
  )
})
