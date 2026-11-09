import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// Right-to-left layouts mirror start and end alignment.

const dialog = (page: Page) =>
  page.getByRole("dialog", { name: "Edit profile" })
const trigger = (page: Page) => page.getByRole("button", { name: "Profile" })

test("with align start, the popover lines up with the trigger's right edge", async ({
  page,
  open,
}) => {
  await open("popover", { dir: "rtl", align: "start", layout: "right" })
  await trigger(page).click()
  const popup = (await dialog(page).boundingBox())!
  const anchor = (await trigger(page).boundingBox())!
  expect(
    Math.abs(popup.x + popup.width - (anchor.x + anchor.width))
  ).toBeLessThanOrEqual(1)
})

test("the arrow still points at the middle of the trigger", async ({
  page,
  open,
}) => {
  await open("popover", { dir: "rtl" })
  await trigger(page).click()
  await expect(dialog(page)).toBeVisible()
  const arrow = (await page
    .locator('.arrow, [data-slot="popover-arrow"]')
    .first()
    .boundingBox())!
  const anchor = (await trigger(page).boundingBox())!
  expect(
    Math.abs(arrow.x + arrow.width / 2 - (anchor.x + anchor.width / 2))
  ).toBeLessThanOrEqual(1)
})
