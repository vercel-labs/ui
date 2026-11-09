import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// Right-to-left layouts mirror the arrow keys and start alignment.

const trigger = (page: Page, name: string) =>
  page.getByRole("button", { name, exact: true })
const link = (page: Page, name: string) =>
  page.getByRole("link", { name, exact: true })

test("Left moves to the next item and Right to the previous one", async ({
  page,
  open,
}) => {
  await open("navigation-menu", { dir: "rtl" })
  await trigger(page, "Products").focus()
  await page.keyboard.press("ArrowLeft")
  await expect(trigger(page, "Resources")).toBeFocused()
  await page.keyboard.press("ArrowRight")
  await expect(trigger(page, "Products")).toBeFocused()
})

test("the viewport lines up with the open trigger's right edge", async ({
  page,
  open,
}) => {
  await open("navigation-menu", { dir: "rtl", layout: "right" })
  await trigger(page, "Products").hover()
  await expect(link(page, "Analytics")).toBeVisible()
  const viewport = (await page.locator(".nav-viewport").boundingBox())!
  const anchor = (await trigger(page, "Products").boundingBox())!
  await expect(async () => {
    const box = (await page.locator(".nav-viewport").boundingBox())!
    expect(
      Math.abs(box.x + box.width - (anchor.x + anchor.width))
    ).toBeLessThanOrEqual(1)
  }).toPass()
  expect(viewport.y).toBeGreaterThanOrEqual(anchor.y + anchor.height - 1)
})

test(
  "motion is logical: the next item's content enters from the end",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("navigation-menu", { dir: "rtl", layout: "right" })
    await trigger(page, "Products").hover()
    await expect(link(page, "Analytics")).toBeVisible()
    const box = (await trigger(page, "Resources").boundingBox())!
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, {
      steps: 4,
    })
    await expect(
      page.locator(".nav-content", { has: link(page, "Blog") })
    ).toHaveAttribute("data-motion", "from-end")
  }
)
