import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "../fixtures"
import { routeAvatars } from "./avatar.helpers"

async function audit(page: import("@playwright/test").Page) {
  // Page structure rules are about the fixture page, not the components.
  const results = await new AxeBuilder({ page })
    .disableRules(["region", "landmark-one-main", "page-has-heading-one"])
    .analyze()
  return results.violations.map(
    (violation) => `${violation.id}: ${violation.help}`
  )
}

test("no axe violations while images load", async ({ page, open }) => {
  await routeAvatars(page, { slowMs: 10_000 })
  await open("avatar")
  expect(await audit(page)).toEqual([])
})

test("no axe violations once images loaded or failed", async ({
  page,
  open,
}) => {
  await routeAvatars(page)
  await open("avatar")
  await expect(page.getByRole("img", { name: "Hedy Lamarr" })).toBeVisible()
  expect(await audit(page)).toEqual([])
})

// Every implementation must expose the same accessibility tree: a loaded
// image by its alt text, and a fallback by its text.
test("accessibility tree", async ({ page, open }) => {
  await routeAvatars(page, { slowMs: 10_000 })
  await open("avatar")
  await expect(page.getByRole("img", { name: "Hedy Lamarr" })).toBeVisible()
  await expect(page.locator(".fixture")).toMatchAriaSnapshot(`
    - button "Before"
    - img "Ada Lovelace"
    - text: GH AT
    - img "Hedy Lamarr"
    - button "Change image"
  `)
})
