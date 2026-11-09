import { expect, test } from "../fixtures"
import { wrappedContentFixture as f } from "../fixtures/wrapped-content"

// A data root renders its own list unless the app renders the content. The
// app's content may sit inside a fragment or a wrapping element, and the root
// still finds it, so it never renders a second list.

test.beforeEach(async ({ open }) => {
  await open("wrapped-content")
})

test("a select finds its content inside a fragment", async ({ page }) => {
  await page.getByRole("combobox", { name: f.select }).click()
  await expect(page.getByRole("option", { name: "Apple" })).toBeVisible()
  await expect(page.getByRole("listbox")).toHaveCount(1)
})

test("a combobox finds its content inside a wrapping element", async ({
  page,
}) => {
  await page.getByRole("combobox", { name: f.combobox }).fill("a")
  await expect(page.getByRole("option", { name: "Apple" })).toBeVisible()
  await expect(page.getByRole("listbox")).toHaveCount(1)
})

test("an autocomplete finds its content inside a wrapping element", async ({
  page,
}) => {
  await page.getByRole("combobox", { name: f.autocomplete }).fill("a")
  await expect(page.getByRole("option", { name: "Apple" })).toBeVisible()
  await expect(page.getByRole("listbox")).toHaveCount(1)
})

test("a trigger menu finds its content inside a fragment", async ({ page }) => {
  await page
    .getByRole("textbox", { name: f.triggerMenu })
    .pressSequentially("@")
  await expect(page.getByRole("option", { name: "Apple" })).toBeVisible()
  await expect(page.getByRole("listbox")).toHaveCount(1)
})
