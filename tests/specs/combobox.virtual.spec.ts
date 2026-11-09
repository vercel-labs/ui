import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// A virtualized list of 10,000 items: the page renders only the rows in view,
// and the combobox still moves through, filters and announces every item.

const input = (page: Page) => page.getByRole("combobox", { name: "Item" })

test.describe("virtualized", () => {
  test.beforeEach(async ({ open }) => {
    await open("combobox-virtual")
  })

  test("renders only the rows in view, each with its place in the whole list", async ({
    page,
  }) => {
    await input(page).focus()
    await page.keyboard.press("ArrowDown")
    const options = page.getByRole("option")
    await expect(options.first()).toHaveAttribute("aria-setsize", "10000")
    expect(await options.count()).toBeLessThan(30)
  })

  test("arrow keys reach items that weren't rendered, and the active descendant follows", async ({
    page,
  }) => {
    await input(page).focus()
    await page.keyboard.press("ArrowDown")
    for (let step = 0; step < 49; step++) {
      await page.keyboard.press("ArrowDown")
    }
    const item = page.getByRole("option", { name: "Item 50", exact: true })
    await expect(item).toHaveAttribute("data-highlighted", "")
    await expect(item).toHaveAttribute("aria-posinset", "50")
    await expect(input(page)).toHaveAttribute(
      "aria-activedescendant",
      (await item.getAttribute("id"))!
    )
  })

  test("filtering covers every item, rendered or not", async ({ page }) => {
    await input(page).fill("9999")
    await expect(
      page.getByRole("option", { name: "Item 9999", exact: true })
    ).toBeVisible()
    await expect(page.getByRole("option").first()).toHaveAttribute(
      "aria-setsize",
      "1"
    )
  })
})
