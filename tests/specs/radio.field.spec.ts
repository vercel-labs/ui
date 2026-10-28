import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"
import { fieldRadiosFixture as f } from "../fixtures/field"

// A Field around each radio of a group names that radio with its label, and
// pressing the label checks it, while a Field around the whole group still
// names the group. The radios keep the group's one tab stop and arrow keys,
// and a radio its field disables, or one disabled later, gives up the stop.

const radio = (page: Page, name: string) => page.getByRole("radio", { name, exact: true })

test.describe("with every radio enabled", () => {
  test.beforeEach(async ({ open }) => {
    await open("field-radios")
  })

  test("each radio is named by the label of its own field", async ({ page }) => {
    for (const { label } of f.sizes) await expect(radio(page, label)).toBeVisible()
  })

  test("the field around the group still names the group", async ({ page }) => {
    await expect(page.getByRole("radiogroup", { name: f.label })).toBeVisible()
  })

  test("clicking a radio's label checks it and unchecks the others", async ({ page }) => {
    for (const { label } of f.sizes) {
      await page.getByText(label, { exact: true }).click()
      await expect(radio(page, label)).toBeChecked()
      for (const other of f.sizes)
        if (other.label !== label) await expect(radio(page, other.label)).not.toBeChecked()
    }
  })

  test("the group keeps one tab stop", async ({ page, tab }) => {
    const [small] = f.sizes
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(radio(page, small.label)).toBeFocused()
    await tab()
    await expect(page.getByRole("button", { name: "After" })).toBeFocused()
  })

  test("arrow keys move between the radios and check them", async ({ page, tab }) => {
    const [small, medium, large] = f.sizes
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(radio(page, small.label)).toBeFocused()
    await page.keyboard.press("ArrowDown")
    await expect(radio(page, medium.label)).toBeFocused()
    await expect(radio(page, medium.label)).toBeChecked()
    await page.keyboard.press("ArrowDown")
    await expect(radio(page, large.label)).toBeChecked()
    await page.keyboard.press("ArrowUp")
    await expect(radio(page, medium.label)).toBeChecked()
  })
})

test.describe("a disabled radio", () => {
  test("a disabled field around the first radio moves the tab stop to the next", async ({
    page,
    open,
    tab,
  }) => {
    const [small, medium] = f.sizes
    await open("field-radios", { "disabled-field": "" })
    await expect(radio(page, small.label)).toBeDisabled()
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(radio(page, medium.label)).toBeFocused()
  })

  test("disabling the first radio after it renders moves the tab stop to the next", async ({
    page,
    open,
    tab,
  }) => {
    const [small, medium] = f.sizes
    await open("field-radios")
    await page.getByRole("button", { name: f.disableFirst }).click()
    await expect(radio(page, small.label)).toBeDisabled()
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(radio(page, medium.label)).toBeFocused()
  })

  test("enabling the first radio again gives it back the tab stop", async ({ page, open, tab }) => {
    const [small] = f.sizes
    await open("field-radios")
    await page.getByRole("button", { name: f.disableFirst }).click()
    await expect(radio(page, small.label)).toBeDisabled()
    await page.getByRole("button", { name: f.disableFirst }).click()
    await expect(radio(page, small.label)).toBeEnabled()
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(radio(page, small.label)).toBeFocused()
  })
})
