import AxeBuilder from "@axe-core/playwright"
import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

const link = (page: Page) => page.getByRole("link", { name: "@ada" })

async function audit(page: Page) {
  // Page structure rules are about the fixture page, not the component.
  const results = await new AxeBuilder({ page })
    .disableRules(["region", "landmark-one-main", "page-has-heading-one"])
    .analyze()
  return results.violations.map(
    (violation) => `${violation.id}: ${violation.help}`
  )
}

test("no axe violations while closed", async ({ page, open }) => {
  await open("hover-card")
  expect(await audit(page)).toEqual([])
})

test("no axe violations while open", async ({ page, open }) => {
  await open("hover-card")
  await link(page).hover()
  await expect(page.getByRole("link", { name: "View profile" })).toBeVisible()
  expect(await audit(page)).toEqual([])
})

test("the trigger stays a plain link", async ({ page, open }) => {
  await open("hover-card")
  await expect(link(page)).toHaveAttribute("href", "#ada")
  await expect(link(page)).not.toHaveAttribute("aria-haspopup")
})

// Every implementation must expose the same accessibility tree.
test("accessibility tree", async ({ page, open }) => {
  await open("hover-card")
  await link(page).hover()
  await expect(page.getByRole("link", { name: "View profile" })).toBeVisible()
  await expect(page.locator(".hover-card")).toMatchAriaSnapshot(`
    - paragraph:
      - strong: Ada Lovelace
    - paragraph: Wrote the first program for the Analytical Engine.
    - link "View profile":
      - /url: "#profile"
  `)
})
