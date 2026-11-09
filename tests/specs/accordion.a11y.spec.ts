import AxeBuilder from "@axe-core/playwright"
import { expect, regionNamed, test, triggerNamed } from "../fixtures"

async function audit(page: import("@playwright/test").Page) {
  // Page structure rules are about the fixture page, not the component.
  const results = await new AxeBuilder({ page })
    .disableRules(["region", "landmark-one-main", "page-has-heading-one"])
    .analyze()
  return results.violations.map(
    (violation) => `${violation.id}: ${violation.help}`
  )
}

test("no axe violations with the default item expanded", async ({
  page,
  open,
}) => {
  await open("accordion")
  await expect(regionNamed(page, "Shipping")).toBeVisible()
  expect(await audit(page)).toEqual([])
})

test("no axe violations with every item collapsed", async ({ page, open }) => {
  await open("accordion", { default: "none" })
  await expect(triggerNamed(page, "Shipping")).toHaveAttribute(
    "aria-expanded",
    "false"
  )
  expect(await audit(page)).toEqual([])
})

test("no axe violations with several items expanded", async ({
  page,
  open,
}) => {
  await open("accordion", { multiple: "", default: "shipping,returns,support" })
  await expect(regionNamed(page, "Support")).toBeVisible()
  expect(await audit(page)).toEqual([])
})

test("no axe violations with focus on a disabled trigger", async ({
  page,
  open,
}) => {
  await open("accordion")
  await triggerNamed(page, "Warranty").focus()
  expect(await audit(page)).toEqual([])
})

test("no axe violations with collapsed panels kept mounted", async ({
  page,
  open,
}) => {
  await open("accordion", { "keep-mounted": "" })
  await expect(regionNamed(page, "Shipping")).toBeVisible()
  expect(await audit(page)).toEqual([])
})

test("no axe violations with collapsed panels hidden until found", async ({
  page,
  open,
}) => {
  await open("accordion", { "hidden-until-found": "" })
  await expect(regionNamed(page, "Shipping")).toBeVisible()
  expect(await audit(page)).toEqual([])
})

test("no axe violations with the whole accordion disabled", async ({
  page,
  open,
}) => {
  await open("accordion", { disabled: "" })
  await expect(regionNamed(page, "Shipping")).toBeVisible()
  expect(await audit(page)).toEqual([])
})

test("each panel is named by its trigger", async ({ page, open }) => {
  await open("accordion", { multiple: "", default: "shipping,returns" })
  await expect(page.getByRole("region", { name: "Shipping" })).toBeVisible()
  await expect(page.getByRole("region", { name: "Returns" })).toBeVisible()
})

// Every implementation must expose the same accessibility tree.
test("accessibility tree", async ({ page, open }) => {
  await open("accordion")
  await expect(regionNamed(page, "Shipping")).toBeVisible()
  await expect(page.locator(".fixture")).toMatchAriaSnapshot(`
    - button "Before"
    - heading "Shipping" [level=3]:
      - button "Shipping" [expanded]
    - region "Shipping": We ship worldwide within five business days.
    - heading "Returns" [level=3]:
      - button "Returns"
    - heading "Warranty" [level=3]:
      - button "Warranty" [disabled]
    - heading "Support" [level=3]:
      - button "Support"
    - button "After"
    - status "Last action"
  `)
})
