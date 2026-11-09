import AxeBuilder from "@axe-core/playwright"
import { collapsibleFixture as fixture } from "../fixtures/collapsible"
import { expect, test } from "../fixtures"

async function audit(page: import("@playwright/test").Page) {
  // Page structure rules are about the fixture page, not the component.
  const results = await new AxeBuilder({ page })
    .disableRules(["region", "landmark-one-main", "page-has-heading-one"])
    .analyze()
  return results.violations.map(
    (violation) => `${violation.id}: ${violation.help}`
  )
}

const states: [string, Record<string, string>][] = [
  ["closed", {}],
  ["open", { open: "" }],
  ["disabled", { disabled: "" }],
  ["closed and kept mounted", { "keep-mounted": "" }],
  ["closed and hidden until found", { "hidden-until-found": "" }],
]

for (const [name, options] of states) {
  test(`no axe violations ${name}`, async ({ page, open }) => {
    await open("collapsible", options)
    await expect(
      page.getByRole("button", { name: fixture.trigger })
    ).toBeVisible()
    expect(await audit(page)).toEqual([])
  })
}

// Every implementation must expose the same accessibility tree.
test("accessibility tree", async ({ page, open }) => {
  await open("collapsible", { open: "" })
  await expect(page.getByText(fixture.content)).toBeVisible()
  await expect(page.locator(".fixture")).toMatchAriaSnapshot(`
    - button "Before"
    - button "${fixture.trigger}" [expanded]
    - paragraph: ${fixture.content}
    - text: ${fixture.field}
    - textbox "${fixture.field}"
    - button "${fixture.close}"
    - button "After"
    - status "Last action"
    - button "${fixture.controller}"
  `)
})
