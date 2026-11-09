import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// Right to left, the suggestions line up with the field's start, and inline
// completion still selects the rest after the caret.

const input = (page: Page) => page.getByRole("combobox", { name: "Fruit" })

test("the suggestions line up with the field's right edge", async ({
  page,
  open,
}) => {
  await open("autocomplete", { dir: "rtl", layout: "right" })
  await input(page).fill("a")
  await expect(page.getByRole("listbox")).toBeVisible()
  const popup = (await page.locator(".list-popup").first().boundingBox())!
  const field = (await input(page).boundingBox())!
  expect(
    Math.abs(popup.x + popup.width - (field.x + field.width))
  ).toBeLessThanOrEqual(1)
})

test(
  "inline completion selects the rest after the caret",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("autocomplete", { dir: "rtl", inline: "" })
    await input(page).pressSequentially("gr")
    await expect(input(page)).toHaveValue("grape")
    expect(
      await input(page).evaluate((el: HTMLInputElement) => [
        el.selectionStart,
        el.selectionEnd,
      ])
    ).toEqual([2, 5])
  }
)
