import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "../fixtures"
import { fieldChoiceCardFixture as f } from "../fixtures/field"

async function audit(page: import("@playwright/test").Page) {
  // Page structure rules are about the fixture page, not the components.
  const results = await new AxeBuilder({ page })
    .disableRules(["region", "landmark-one-main", "page-has-heading-one"])
    .analyze()
  return results.violations.map(
    (violation) => `${violation.id}: ${violation.help}`
  )
}

test("no axe violations with labels wrapping fields", async ({
  page,
  open,
}) => {
  await open("field-choice-card")
  const [first] = f.cards
  await expect(page.getByRole("checkbox", { name: first.title })).toBeVisible()
  expect(await audit(page)).toEqual([])
  await page.getByText(first.description).click()
  await expect(page.getByRole("checkbox", { name: first.title })).toBeChecked()
  expect(await audit(page)).toEqual([])
})
