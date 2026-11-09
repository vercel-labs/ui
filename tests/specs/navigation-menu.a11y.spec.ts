import AxeBuilder from "@axe-core/playwright"
import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

const trigger = (page: Page, name: string) =>
  page.getByRole("button", { name, exact: true })
const link = (page: Page, name: string) =>
  page.getByRole("link", { name, exact: true })

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
  await open("navigation-menu")
  expect(await audit(page)).toEqual([])
})

test(
  "no axe violations while a panel is open",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("navigation-menu")
    await trigger(page, "Products").click()
    await expect(link(page, "Analytics")).toBeVisible()
    expect(await audit(page)).toEqual([])
  }
)

test("no axe violations with closed panels kept findable", async ({
  page,
  open,
}) => {
  await open("navigation-menu", { "hidden-until-found": "" })
  expect(await audit(page)).toEqual([])
})

test(
  "no axe violations with a nested menu open",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("navigation-menu", { nested: "", delay: "2000" })
    await trigger(page, "Resources").click()
    await trigger(page, "Learn").click()
    await expect(link(page, "Tutorials")).toBeVisible()
    expect(await audit(page)).toEqual([])
  }
)

test("the menu is a navigation landmark named by its label", async ({
  page,
  open,
}) => {
  await open("navigation-menu")
  await expect(page.getByRole("navigation", { name: "Main" })).toBeVisible()
})

test("triggers are buttons that say whether their panel is expanded, and which panel", async ({
  page,
  open,
}) => {
  await open("navigation-menu")
  await expect(trigger(page, "Products")).toHaveAttribute(
    "aria-expanded",
    "false"
  )
  await trigger(page, "Products").click()
  await expect(trigger(page, "Products")).toHaveAttribute(
    "aria-expanded",
    "true"
  )
  const panel = await trigger(page, "Products").getAttribute("aria-controls")
  expect(panel).toBeTruthy()
  await expect(page.locator(`[id="${panel}"]`)).toContainText("Analytics")
})

test("nothing is a menu: no menu or menuitem roles", async ({ page, open }) => {
  await open("navigation-menu")
  await trigger(page, "Products").click()
  await expect(link(page, "Analytics")).toBeVisible()
  await expect(page.getByRole("menu")).toHaveCount(0)
  await expect(page.getByRole("menuitem")).toHaveCount(0)
})

// Every implementation must expose the same accessibility tree.
test("accessibility tree", async ({ page, open }) => {
  await open("navigation-menu")
  await expect(page.getByRole("navigation", { name: "Main" }))
    .toMatchAriaSnapshot(`
    - navigation "Main":
      - list:
        - listitem:
          - button "Products"
        - listitem:
          - button "Resources"
        - listitem:
          - link "Pricing":
            - /url: "#pricing"
  `)
})
