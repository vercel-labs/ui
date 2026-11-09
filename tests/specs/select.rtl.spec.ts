import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// Right-to-left layouts mirror start alignment, so the list lines up with the trigger's right edge.

const trigger = (page: Page) => page.getByRole("combobox", { name: "Fruit" })

test("the list lines up with the trigger's right edge", async ({
  page,
  open,
}) => {
  await open("select", { dir: "rtl", layout: "right" })
  await trigger(page).click()
  await expect(page.getByRole("listbox")).toBeVisible()
  const popup = (await page.locator(".list-popup").first().boundingBox())!
  const anchor = (await trigger(page).boundingBox())!
  expect(
    Math.abs(popup.x + popup.width - (anchor.x + anchor.width))
  ).toBeLessThanOrEqual(1)
})
