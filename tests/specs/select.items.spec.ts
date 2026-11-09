import type { Page } from "@playwright/test"
import { changeItems, expect, test } from "../fixtures"
import { changedItems } from "../fixtures/select"

// Items that change while the list is open, like options streamed in or
// sorted by the app. The list follows its items at once: the order on screen
// is the order the keys move through, and the selection and the highlight
// stay on their items while those items stay in the list. The tests where the
// highlight stays on its item are tagged @enhancement.

const trigger = (page: Page) => page.getByRole("combobox", { name: "Fruit" })
const listbox = (page: Page) => page.getByRole("listbox")
const option = (page: Page, name: string) =>
  page.getByRole("option", { name, exact: true })

// The options in the order the page shows them. An item's text may end with its check.
async function expectOrder(page: Page, labels: string[]) {
  await expect(page.getByRole("option")).toHaveText(
    labels.map((label) => new RegExp(`^✓?${label}`))
  )
}

async function openOnSelected(page: Page) {
  await trigger(page).focus()
  await page.keyboard.press("Enter")
  await expect(listbox(page)).toBeVisible()
}

test.describe("items that change while open", () => {
  test.beforeEach(async ({ open }) => {
    await open("select", { value: "banana" })
  })

  test(
    "reordered items show in their new order, and the keys follow it",
    { tag: "@enhancement" },
    async ({ page }) => {
      await openOnSelected(page)
      await page.keyboard.press("ArrowDown")
      await expect(option(page, "Blueberry")).toBeFocused()
      await changeItems(page, "reversed")
      await expectOrder(
        page,
        changedItems.reversed.map((item) => item.label)
      )
      await expect(listbox(page)).toBeVisible()
      await expect(option(page, "Blueberry")).toBeFocused()
      await expect(option(page, "Banana")).toHaveAttribute(
        "aria-selected",
        "true"
      )
      await page.keyboard.press("ArrowDown")
      await expect(option(page, "Banana")).toBeFocused()
      await page.keyboard.press("ArrowUp")
      await page.keyboard.press("ArrowUp")
      await expect(option(page, "Cherry")).toBeFocused()
    }
  )

  test(
    "replaced items keep the selection and the highlight on items that stay",
    { tag: "@enhancement" },
    async ({ page }) => {
      await openOnSelected(page)
      await page.keyboard.press("ArrowDown")
      await page.keyboard.press("ArrowDown")
      await expect(option(page, "Cherry")).toBeFocused()
      await changeItems(page, "replaced")
      await expectOrder(
        page,
        changedItems.replaced.map((item) => item.label)
      )
      await expect(listbox(page)).toBeVisible()
      await expect(option(page, "Cherry")).toBeFocused()
      await expect(option(page, "Banana")).toHaveAttribute(
        "aria-selected",
        "true"
      )
      await page.keyboard.press("ArrowDown")
      await expect(option(page, "Kiwi")).toBeFocused()
      await page.keyboard.press("ArrowDown")
      await expect(option(page, "Banana")).toBeFocused()
      await page.keyboard.press("Home")
      await expect(option(page, "Peach")).toBeFocused()
      // Typing finds items in the new order too.
      await page.keyboard.press("k")
      await expect(option(page, "Kiwi")).toBeFocused()
      await expect(trigger(page)).toContainText("Banana")
    }
  )

  test(
    "removing the highlighted item keeps the list open, and the keys start over",
    { tag: "@enhancement" },
    async ({ page }) => {
      await openOnSelected(page)
      await page.keyboard.press("End")
      await expect(option(page, "Orange")).toBeFocused()
      await changeItems(page, "replaced")
      await expectOrder(
        page,
        changedItems.replaced.map((item) => item.label)
      )
      await expect(listbox(page)).toBeVisible()
      await page.keyboard.press("ArrowDown")
      await expect(option(page, "Peach")).toBeFocused()
      await page.keyboard.press("Escape")
      await expect(listbox(page)).toBeHidden()
      await expect(trigger(page)).toBeFocused()
      await expect(trigger(page)).toContainText("Banana")
    }
  )

  test("the new order stays after the list closes and opens again", async ({
    page,
  }) => {
    await openOnSelected(page)
    await changeItems(page, "reversed")
    await page.keyboard.press("Escape")
    await expect(listbox(page)).toBeHidden()
    await openOnSelected(page)
    await expectOrder(
      page,
      changedItems.reversed.map((item) => item.label)
    )
    await expect(option(page, "Banana")).toBeFocused()
    await page.keyboard.press("ArrowDown")
    await expect(option(page, "Apple")).toBeFocused()
  })

  test("choosing an item after a reorder chooses that item", async ({
    page,
  }) => {
    await openOnSelected(page)
    await changeItems(page, "reversed")
    await option(page, "Mango").click()
    await expect(listbox(page)).toBeHidden()
    await expect(trigger(page)).toContainText("Mango")
  })
})
