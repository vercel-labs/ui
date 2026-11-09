import AxeBuilder from "@axe-core/playwright"
import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

async function audit(page: Page) {
  // Page structure rules are about the fixture page, not the component.
  const results = await new AxeBuilder({ page })
    .disableRules(["region", "landmark-one-main", "page-has-heading-one"])
    .analyze()
  return results.violations.map(
    (violation) => `${violation.id}: ${violation.help}`
  )
}

const item = (page: Page, name: string) =>
  page.getByRole("treeitem", { name, exact: true })

test("no axe violations with every branch collapsed", async ({
  page,
  open,
}) => {
  await open("tree")
  await expect(item(page, "src")).toBeVisible()
  expect(await audit(page)).toEqual([])
})

test("no axe violations with nested branches expanded and an item selected", async ({
  page,
  open,
}) => {
  await open("tree", { expanded: "src,components", default: "dialog.tsx" })
  await expect(item(page, "dialog.tsx")).toBeVisible()
  expect(await audit(page)).toEqual([])
})

test("no axe violations with checkboxes", async ({ page, open }) => {
  await open("tree", { checkable: "", selection: "none", expanded: "src" })
  await item(page, "src")
    .locator(':scope > [data-slot="tree-checkbox"]')
    .click()
  expect(await audit(page)).toEqual([])
})

test("no axe violations with multiple selection and collapsed groups kept mounted", async ({
  page,
  open,
}) => {
  await open("tree", {
    selection: "multiple",
    "keep-mounted": "",
    default: "src,docs",
  })
  expect(await audit(page)).toEqual([])
})

test("the tree is named, and each item by its label alone", async ({
  page,
  open,
}) => {
  await open("tree", { expanded: "src" })
  await expect(page.getByRole("tree", { name: "Files" })).toBeVisible()
  await expect(item(page, "src")).toBeVisible()
  await expect(page.getByRole("group")).toHaveCount(1)
})

test("the accessibility tree", async ({ page, open }) => {
  await open("tree", { expanded: "src", default: "index.ts" })
  await expect(page.getByRole("tree")).toMatchAriaSnapshot(`
    - tree "Files":
      - treeitem "src" [expanded] [level=1]:
        - group:
          - treeitem "components" [level=2]
          - treeitem "index.ts" [level=2] [selected]
          - treeitem "legacy.ts" [disabled] [level=2]
      - treeitem "docs" [level=1]
      - treeitem "package.json" [level=1]
  `)
})
