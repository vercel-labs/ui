import AxeBuilder from "@axe-core/playwright"
import { expect, expectFocus, menuNamed, test } from "../fixtures"
import { enter, menubar, trigger } from "./menubar.helpers"

async function audit(page: import("@playwright/test").Page) {
  // Page structure rules are about the fixture page, not the components.
  const results = await new AxeBuilder({ page })
    .disableRules(["region", "landmark-one-main", "page-has-heading-one"])
    .analyze()
  return results.violations.map((violation) => `${violation.id}: ${violation.help}`)
}

test("no axe violations at rest", async ({ page, open }) => {
  await open("menubar")
  expect(await audit(page)).toEqual([])
})

test("no axe violations with a menu open", { tag: "@enhancement" }, async ({ page, open, tab }) => {
  await open("menubar")
  await enter(page, tab)
  await page.keyboard.press("ArrowDown")
  await expectFocus(page, "New Tab")
  expect(await audit(page)).toEqual([])
})

test("no axe violations with a submenu open", { tag: "@enhancement" }, async ({ page, open }) => {
  await open("menubar")
  await trigger(page, "File").click()
  await page.getByRole("menuitem", { name: "Share" }).click()
  await expect(menuNamed(page, "Share")).toBeVisible()
  expect(await audit(page)).toEqual([])
})

test("no axe violations in a vertical menubar", async ({ page, open }) => {
  await open("menubar", { orientation: "vertical" })
  expect(await audit(page)).toEqual([])
})

test("an open menu is named by its trigger, which says it's expanded", async ({ page, open }) => {
  await open("menubar")
  await trigger(page, "View").click()
  await expect(menuNamed(page, "View")).toBeVisible()
  await expect(trigger(page, "View")).toHaveAttribute("aria-expanded", "true")
  await expect(trigger(page, "File")).toHaveAttribute("aria-expanded", "false")
})

// Every implementation must expose the same accessibility tree.
test("accessibility tree", async ({ page, open }) => {
  await open("menubar")
  await expect(menubar(page)).toMatchAriaSnapshot(`
    - menubar "Editor":
      - menuitem "File"
      - menuitem "Edit"
      - menuitem "View"
      - menuitem "Profiles"
      - menuitem "Help" [disabled]
  `)
  await trigger(page, "Profiles").click()
  await expect(menuNamed(page, "Profiles")).toMatchAriaSnapshot(`
    - menu "Profiles":
      - group:
        - menuitemradio "Hollis" [checked=false]
        - menuitemradio "Inès" [checked]
        - menuitemradio "Kofi" [checked=false]
  `)
})
