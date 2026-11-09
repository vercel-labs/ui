import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// Right-to-left layouts mirror start alignment, and the arrow toward the chips is ArrowRight.

const input = (page: Page) => page.getByRole("combobox", { name: "Country" })

test("the list lines up with the input's right edge", async ({
  page,
  open,
}) => {
  await open("combobox", { dir: "rtl", layout: "right" })
  await input(page).fill("a")
  await expect(page.getByRole("listbox")).toBeVisible()
  const popup = (await page.locator(".list-popup").first().boundingBox())!
  const anchor = (await input(page).boundingBox())!
  expect(
    Math.abs(popup.x + popup.width - (anchor.x + anchor.width))
  ).toBeLessThanOrEqual(1)
})

test(
  "ArrowRight at the start of the input moves to the last chip",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("combobox", { dir: "rtl", multiple: "", value: "br,fr" })
    await input(page).focus()
    await page.keyboard.press("ArrowRight")
    await expect(
      page.locator('[data-slot="combobox-chip"]', { hasText: "France" })
    ).toBeFocused()
  }
)
