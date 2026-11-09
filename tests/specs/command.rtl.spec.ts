import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// Right to left, the field and list follow the document's direction, and the
// keys that move through the list are the same.

const input = (page: Page) =>
  page.getByRole("combobox", { name: "Search commands" })

test("arrow keys move the highlight right to left too", async ({
  page,
  open,
}) => {
  await open("command", { dir: "rtl" })
  await input(page).focus()
  await page.keyboard.press("ArrowDown")
  await expect(
    page.getByRole("option", { name: "Search Emoji" })
  ).toHaveAttribute("data-highlighted", "")
})

test("ArrowLeft and ArrowRight move the caret, not the highlight", async ({
  page,
  open,
}) => {
  await open("command", { dir: "rtl" })
  await input(page).fill("bil")
  await page.keyboard.press("ArrowRight")
  await page.keyboard.press("ArrowLeft")
  await expect(page.getByRole("option", { name: /Billing/ })).toHaveAttribute(
    "data-highlighted",
    ""
  )
  await expect(input(page)).toBeFocused()
})
