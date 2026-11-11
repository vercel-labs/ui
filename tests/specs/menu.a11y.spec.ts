import AxeBuilder from "@axe-core/playwright"
import { expect, menuNamed, patternProblems, test } from "../fixtures"

test.beforeEach(async ({ open }) => {
  await open("menu")
})

async function audit(page: import("@playwright/test").Page) {
  // Page structure rules are about the fixture page, not the component.
  const results = await new AxeBuilder({ page })
    .disableRules(["region", "landmark-one-main", "page-has-heading-one"])
    .analyze()
  return results.violations.map(
    (violation) => `${violation.id}: ${violation.help}`
  )
}

test("no axe violations while closed", async ({ page }) => {
  expect(await audit(page)).toEqual([])
})

test("no axe violations while open", async ({ page }) => {
  await page.getByRole("button", { name: "File" }).click()
  await expect(menuNamed(page, "File")).toBeVisible()
  expect(await audit(page)).toEqual([])
})

test("no axe violations with a submenu open", async ({ page }) => {
  await page.getByRole("button", { name: "File" }).click()
  await page.getByRole("menuitem", { name: "Share" }).hover()
  await expect(menuNamed(page, "Share")).toBeVisible()
  expect(await audit(page)).toEqual([])
})

test("menus are labelled by their triggers", async ({ page }) => {
  await page.getByRole("button", { name: "File" }).click()
  await expect(page.getByRole("menu", { name: "File" })).toBeVisible()
  await page.getByRole("menuitem", { name: "Share" }).hover()
  await expect(page.getByRole("menu", { name: "Share" })).toBeVisible()
})

// Every implementation must expose the same accessibility tree.
test("accessibility tree", async ({ page }) => {
  await page.getByRole("button", { name: "File" }).click()
  await expect(page.getByRole("menu")).toMatchAriaSnapshot(`
    - menu "File":
      - menuitem "New file"
      - menuitem "Open…"
      - menuitem "Save" [disabled]
      - separator
      - group "View":
        - menuitemcheckbox "Show sidebar" [checked]
        - menuitemcheckbox "Show status bar"
      - separator
      - group "Sort by":
        - menuitemradio "Name" [checked]
        - menuitemradio "Date"
        - menuitemradio "Size"
      - separator
      - menuitem "Share"
      - menuitem "Delete"
  `)
})

test("checkPattern finds no problems with the menu pattern", async ({
  page,
}) => {
  await page.getByRole("button", { name: "File" }).click()
  await expect(menuNamed(page, "File")).toBeVisible()
  expect(await patternProblems(page, "menu")).toBe("")
})
