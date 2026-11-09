import AxeBuilder from "@axe-core/playwright"
import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

const input = (page: Page) =>
  page.getByRole("combobox", { name: "Search commands" })
const listbox = (page: Page) => page.getByRole("listbox")

async function audit(page: Page) {
  // Page structure rules are about the fixture page, not the component.
  const results = await new AxeBuilder({ page })
    .disableRules(["region", "landmark-one-main", "page-has-heading-one"])
    .analyze()
  return results.violations.map(
    (violation) => `${violation.id}: ${violation.help}`
  )
}

test("no axe violations with groups, separators and a highlighted command", async ({
  page,
  open,
}) => {
  await open("command")
  await input(page).focus()
  await page.keyboard.press("ArrowDown")
  expect(await audit(page)).toEqual([])
})

test("no axe violations while filtered", async ({ page, open }) => {
  await open("command")
  await input(page).fill("set")
  expect(await audit(page)).toEqual([])
})

test("no axe violations with nothing found", async ({ page, open }) => {
  await open("command")
  await input(page).fill("zzzz")
  await expect(page.getByText("No results found.")).toBeVisible()
  expect(await audit(page)).toEqual([])
})

// Every implementation must expose the same accessibility tree.
test("accessibility tree", async ({ page, open }) => {
  await open("command")
  await expect(input(page)).toMatchAriaSnapshot(
    `- combobox "Search commands" [expanded]`
  )
  await expect(listbox(page)).toMatchAriaSnapshot(`
    - listbox:
      - group "Suggestions":
        - option "Calendar"
        - option "Search Emoji"
        - option "Calculator" [disabled]
      - group "Settings":
        - option /Profile/
        - option /Billing/
        - option "Change theme…"
        - option /Settings/
  `)
})
