import AxeBuilder from "@axe-core/playwright"
import { scrollAreaFixture } from "../fixtures/scroll-area"
import { expect, test } from "../fixtures"
import { area, setScroll, settle, viewport } from "./scroll-area.helpers"

const { tags, gallery, chat } = scrollAreaFixture

async function audit(page: import("@playwright/test").Page) {
  // Page structure rules are about the fixture page, not the components.
  const results = await new AxeBuilder({ page })
    .disableRules(["region", "landmark-one-main", "page-has-heading-one"])
    .analyze()
  return results.violations.map(
    (violation) => `${violation.id}: ${violation.help}`
  )
}

test.beforeEach(async ({ open }) => {
  await open("scroll-area")
})

test("no axe violations at rest", async ({ page }) => {
  await settle(page)
  expect(await audit(page)).toEqual([])
})

test("no axe violations while scrolled and hovered", async ({ page }) => {
  await setScroll(viewport(page, tags.label), { top: 300 })
  await setScroll(viewport(page, chat.label), { top: 0 })
  await viewport(page, gallery.label).hover()
  await settle(page)
  expect(await audit(page)).toEqual([])
})

test("scrollbars and the corner are hidden from assistive technology", async ({
  page,
}) => {
  const root = area(page, gallery.label)
  for (const part of await root
    .locator(".scroll-area-scrollbar, .scroll-area-corner")
    .all()) {
    await expect(part).toHaveAttribute("aria-hidden", "true")
  }
})

// Every implementation must expose the same accessibility tree.
test("accessibility tree", async ({ page }) => {
  await expect(page.locator(".fixture")).toMatchAriaSnapshot(`
    - button "Before"
    - region "Tags":
      - paragraph: Tag 1
    - region "Gallery":
      - link "Artwork 1"
    - region "Short":
      - paragraph: One
      - paragraph: Two
    - region "Messages":
      - paragraph: Message 1
    - button "Add message"
    - button "Stream"
    - button "Add image"
    - button "Load images"
    - button "After"
  `)
})
