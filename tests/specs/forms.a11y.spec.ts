import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "../fixtures"
import { checkbox, save } from "./forms.helpers"

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
  await open("forms")
  await expect(checkbox(page, "Accept the terms")).toBeVisible()
  expect(await audit(page)).toEqual([])
})

test("no axe violations with errors showing", async ({ page, open }) => {
  await open("forms")
  await save(page)
  await expect(page.getByText("Accept the terms to continue.")).toBeVisible()
  expect(await audit(page)).toEqual([])
})

test("no axe violations with everything checked", async ({ page, open }) => {
  await open("forms", { plan: "pro" })
  await checkbox(page, "All toppings").click()
  await checkbox(page, "Accept the terms").click()
  await expect(checkbox(page, "Olives")).toBeChecked()
  expect(await audit(page)).toEqual([])
})

test(
  "no axe violations in a disabled fieldset",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("forms")
    await page.getByRole("button", { name: "Toggle shipping" }).click()
    await expect(checkbox(page, "Gift wrap")).toBeDisabled()
    expect(await audit(page)).toEqual([])
  }
)

test("no axe violations when read-only or disabled", async ({ page, open }) => {
  await open("forms", { readonly: "" })
  await expect(checkbox(page, "Accept the terms")).toBeVisible()
  expect(await audit(page)).toEqual([])
  await open("forms", { disabled: "" })
  await expect(checkbox(page, "Accept the terms")).toBeVisible()
  expect(await audit(page)).toEqual([])
})

test("disabled controls are announced as disabled", async ({ page, open }) => {
  await open("forms", { disabled: "" })
  for (const name of ["Free", "Pro", "Team", "Enterprise"]) {
    await expect(page.getByRole("radio", { name, exact: true })).toBeDisabled()
  }
})

test(
  "controls in a disabled fieldset are announced as disabled",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("forms")
    await page.getByRole("button", { name: "Toggle shipping" }).click()
    await expect(checkbox(page, "Gift wrap")).toBeDisabled()
    await expect(checkbox(page, "Gift wrap")).toHaveAttribute(
      "data-disabled",
      ""
    )
  }
)

test("required controls are announced as required", async ({ page, open }) => {
  await open("forms")
  await expect(checkbox(page, "Accept the terms")).toHaveAttribute(
    "aria-required",
    "true"
  )
  await expect(page.getByRole("radiogroup", { name: "Plan" })).toHaveAttribute(
    "aria-required",
    "true"
  )
})

// Every implementation must expose the same accessibility tree.
test("accessibility tree", async ({ page, open }) => {
  await open("forms")
  await expect(
    page.getByRole("group", { name: "Toppings", exact: true }).last()
  ).toMatchAriaSnapshot(`
    - group "Toppings":
      - checkbox "All toppings" [checked=mixed]
      - text: All toppings
      - checkbox "Cheese" [checked]
      - text: Cheese
      - checkbox "Mushrooms"
      - text: Mushrooms
      - checkbox "Olives"
      - text: Olives
  `)
  await expect(page.getByRole("radiogroup")).toMatchAriaSnapshot(`
    - radiogroup "Plan":
      - radio "Free"
      - text: Free
      - radio "Pro"
      - text: Pro
      - radio "Team" [disabled]
      - text: Team
      - radio "Enterprise"
      - text: Enterprise
  `)
  await expect(page.getByRole("switch", { name: "Wi-Fi" })).toMatchAriaSnapshot(
    `- switch "Wi-Fi" [checked]`
  )
  await expect(checkbox(page, "Accept the terms")).toMatchAriaSnapshot(
    `- checkbox "Accept the terms"`
  )
})
