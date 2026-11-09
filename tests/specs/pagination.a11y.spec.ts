import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "../fixtures"
import { paginationFixture as f } from "../fixtures/pagination"
import { nav, part } from "./pagination.helpers"

async function audit(page: import("@playwright/test").Page) {
  // Page structure rules are about the fixture page, not the components.
  const results = await new AxeBuilder({ page })
    .disableRules(["region", "landmark-one-main", "page-has-heading-one"])
    .analyze()
  return results.violations.map(
    (violation) => `${violation.id}: ${violation.help}`
  )
}

for (const [name, options] of [
  ["on the first page", {}],
  ["in the middle", { page: "5" }],
  ["on the last page", { page: "10" }],
  ["with links", { links: "", page: "5" }],
  ["with links at an end", { links: "" }],
  ["with one page", { count: "1" }],
] as const) {
  test(`no axe violations ${name}`, async ({ page, open }) => {
    await open("pagination", options)
    expect(await audit(page)).toEqual([])
  })
}

test("no axe violations with focus on a disabled step", async ({
  page,
  open,
}) => {
  await open("pagination")
  await part(page, f.previous).focus()
  expect(await audit(page)).toEqual([])
})

test("the landmark is named, and steps by their aria-label", async ({
  page,
  open,
}) => {
  await open("pagination")
  await expect(nav(page)).toBeVisible()
  for (const name of [f.first, f.previous, f.next, f.last]) {
    await expect(part(page, name)).toBeVisible()
  }
})

// Every implementation must expose the same accessibility tree.
test("accessibility tree", async ({ page, open }) => {
  await open("pagination", { page: "5" })
  await expect(nav(page)).toMatchAriaSnapshot(`
    - navigation "Results pages":
      - list:
        - listitem:
          - button "First page"
        - listitem:
          - button "Previous page"
        - listitem:
          - button "1"
        - listitem
        - listitem:
          - button "4"
        - listitem:
          - button "5"
        - listitem:
          - button "6"
        - listitem
        - listitem:
          - button "10"
        - listitem:
          - button "Next page"
        - listitem:
          - button "Last page"
  `)
  await open("pagination", { links: "" })
  await expect(nav(page).getByRole("list")).toMatchAriaSnapshot(`
    - listitem:
      - link "First page"
    - listitem:
      - link "Previous page"
    - listitem:
      - link "1":
        - /url: "#page-1"
  `)
})
