import AxeBuilder from "@axe-core/playwright"
import { expect, panelNamed, tabNamed, test } from "../fixtures"

async function audit(page: import("@playwright/test").Page) {
  // Page structure rules are about the fixture page, not the component.
  const results = await new AxeBuilder({ page })
    .disableRules(["region", "landmark-one-main", "page-has-heading-one"])
    .analyze()
  return results.violations.map(
    (violation) => `${violation.id}: ${violation.help}`
  )
}

test("no axe violations with the default tab selected", async ({
  page,
  open,
}) => {
  await open("tabs")
  await expect(panelNamed(page, "Account")).toBeVisible()
  expect(await audit(page)).toEqual([])
})

test("no axe violations with a panel that holds a field", async ({
  page,
  open,
}) => {
  await open("tabs")
  await tabNamed(page, "Password").click()
  await expect(panelNamed(page, "Password")).toBeVisible()
  expect(await audit(page)).toEqual([])
})

test("no axe violations with focus on a disabled tab", async ({
  page,
  open,
}) => {
  await open("tabs", { activation: "manual" })
  await tabNamed(page, "Account").focus()
  await page.keyboard.press("End")
  await page.keyboard.press("ArrowLeft")
  await expect(tabNamed(page, "Billing")).toBeFocused()
  expect(await audit(page)).toEqual([])
})

test("no axe violations in a vertical tab list", async ({ page, open }) => {
  await open("tabs", { orientation: "vertical" })
  await expect(panelNamed(page, "Account")).toBeVisible()
  expect(await audit(page)).toEqual([])
})

test("no axe violations with hidden panels kept mounted", async ({
  page,
  open,
}) => {
  await open("tabs", { "keep-mounted": "" })
  await expect(panelNamed(page, "Account")).toBeVisible()
  expect(await audit(page)).toEqual([])
})

test("the tab list is named, and each panel is named by its tab", async ({
  page,
  open,
}) => {
  await open("tabs")
  await expect(page.getByRole("tablist", { name: "Settings" })).toBeVisible()
  await expect(page.getByRole("tabpanel", { name: "Account" })).toBeVisible()
  await tabNamed(page, "Notifications").click()
  await expect(
    page.getByRole("tabpanel", { name: "Notifications" })
  ).toBeVisible()
})

// Every implementation must expose the same accessibility tree.
test("accessibility tree", async ({ page, open }) => {
  await open("tabs")
  await expect(page.getByRole("tablist")).toMatchAriaSnapshot(`
    - tablist "Settings":
      - tab "Account" [selected]
      - tab "Password"
      - tab "Billing" [disabled]
      - tab "Notifications"
  `)
  await expect(page.getByRole("tabpanel")).toMatchAriaSnapshot(`
    - tabpanel "Account": Manage your account details.
  `)
})
