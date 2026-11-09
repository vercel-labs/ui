import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// Right-to-left layouts mirror start and end alignment.

const link = (page: Page) => page.getByRole("link", { name: "@ada" })

test("with align start, the card lines up with the link's right edge", async ({
  page,
  open,
}) => {
  await open("hover-card", { dir: "rtl", align: "start", layout: "right" })
  await link(page).hover()
  const card = page.locator(".hover-card")
  await expect(card).toBeVisible()
  const box = (await card.boundingBox())!
  const anchor = (await link(page).boundingBox())!
  expect(
    Math.abs(box.x + box.width - (anchor.x + anchor.width))
  ).toBeLessThanOrEqual(1)
})
