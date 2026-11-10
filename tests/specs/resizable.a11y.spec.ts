import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "../fixtures"
import {
  panel,
  previewHandle,
  sidebarHandle,
  terminalHandle,
} from "./resizable.helpers"

async function audit(page: import("@playwright/test").Page) {
  // Page structure rules are about the fixture page, not the components.
  const results = await new AxeBuilder({ page })
    .disableRules(["region", "landmark-one-main", "page-has-heading-one"])
    .analyze()
  return results.violations.map(
    (violation) => `${violation.id}: ${violation.help}`
  )
}

test("no axe violations at first", async ({ page, open }) => {
  await open("resizable")
  await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "25")
  expect(await audit(page)).toEqual([])
})

test("no axe violations with a panel collapsed", async ({ page, open }) => {
  await open("resizable")
  await sidebarHandle(page).focus()
  await page.keyboard.press("Enter")
  await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "0")
  expect(await audit(page)).toEqual([])
})

test("no axe violations when vertical or disabled", async ({ page, open }) => {
  await open("resizable", { orientation: "vertical", disabled: "" })
  await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", /\d/)
  expect(await audit(page)).toEqual([])
})

test("a handle is a separator that runs across its group", async ({
  page,
  open,
}) => {
  await open("resizable")
  await expect(sidebarHandle(page)).toHaveAttribute(
    "aria-orientation",
    "vertical"
  )
  await expect(terminalHandle(page)).toHaveAttribute(
    "aria-orientation",
    "horizontal"
  )
})

test("a handle controls the panel before it, and its value is that panel's size", async ({
  page,
  open,
}) => {
  await open("resizable")
  const sidebar = await panel(page, "Sidebar").getAttribute("id")
  await expect(sidebarHandle(page)).toHaveAttribute("aria-controls", sidebar!)
  await expect(sidebarHandle(page)).toHaveAttribute("aria-valuemin", "0")
  await expect(sidebarHandle(page)).toHaveAttribute("aria-valuemax", "40")
  await expect(previewHandle(page)).toHaveAttribute("aria-valuemin", "30")
})

test("the accessibility tree", async ({ page, open }) => {
  await open("resizable")
  await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "25")
  await expect(page.locator('[data-slot="resizable"]').first())
    .toMatchAriaSnapshot(`
    - group "Sidebar":
      - button "Sidebar action"
    - separator "Resize sidebar"
    - group "Main":
      - group "Code"
      - separator "Resize terminal"
      - group "Terminal"
    - separator "Resize preview"
    - group "Preview"
  `)
})
