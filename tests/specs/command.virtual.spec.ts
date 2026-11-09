import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// A virtualized list of 10,000 commands: the page renders only the rows in
// view, and the command still ranks, moves through and announces every one.

const input = (page: Page) =>
  page.getByRole("combobox", { name: "Search items" })

test.describe("virtualized", { tag: "@enhancement" }, () => {
  test.beforeEach(async ({ open }) => {
    await open("command-virtual")
  })

  test("renders only the rows in view, each with its place in the whole list", async ({
    page,
  }) => {
    const options = page.getByRole("option")
    await expect(options.first()).toHaveAttribute("aria-setsize", "10000")
    expect(await options.count()).toBeLessThan(30)
  })

  test("arrow keys reach commands that weren't rendered, and the active descendant follows", async ({
    page,
  }) => {
    await input(page).focus()
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

  test("typing ranks every command, rendered or not, best match first", async ({
    page,
  }) => {
    await input(page).fill("Item 9999")
    await expect(page.getByRole("option").first()).toHaveText("Item 9999")
    await expect(page.getByRole("option").first()).toHaveAttribute(
      "data-highlighted",
      ""
    )
  })
})
