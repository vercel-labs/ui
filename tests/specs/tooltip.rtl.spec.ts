import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// Right-to-left layouts mirror start and end alignment.

const save = (page: Page) =>
  page.getByRole("button", { name: "Save", exact: true })
const tip = (page: Page) =>
  page.locator(".tooltip", { hasText: "Save your changes" })

test("with align start, the tooltip lines up with the trigger's right edge", async ({
  page,
  open,
}) => {
  await open("tooltip", { dir: "rtl", align: "start" })
  await save(page).hover()
  await expect(tip(page)).toBeVisible()
  const popup = (await tip(page).boundingBox())!
  const anchor = (await save(page).boundingBox())!
  expect(
    Math.abs(popup.x + popup.width - (anchor.x + anchor.width))
  ).toBeLessThanOrEqual(1)
})

test("the arrow still points at the middle of the trigger", async ({
  page,
  open,
}) => {
  await open("tooltip", { dir: "rtl" })
  await save(page).hover()
  await expect(tip(page)).toBeVisible()
  const arrow = (await page.locator(".tooltip .arrow").first().boundingBox())!
  const anchor = (await save(page).boundingBox())!
  expect(
    Math.abs(arrow.x + arrow.width / 2 - (anchor.x + anchor.width / 2))
  ).toBeLessThanOrEqual(1)
})
