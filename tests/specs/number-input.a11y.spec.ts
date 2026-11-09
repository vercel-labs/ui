import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "../fixtures"
import { amount, quantity, save } from "./number-input.helpers"

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
  await open("number-input")
  await expect(quantity(page)).toBeVisible()
  expect(await audit(page)).toEqual([])
})

test("no axe violations when disabled or read-only", async ({ page, open }) => {
  await open("number-input", { disabled: "" })
  await expect(quantity(page)).toBeDisabled()
  expect(await audit(page)).toEqual([])
  await open("number-input", { readonly: "" })
  await expect(quantity(page)).toBeVisible()
  expect(await audit(page)).toEqual([])
})

test("no axe violations when a required field is empty", async ({
  page,
  open,
}) => {
  await open("number-input", { quantity: "", required: "" })
  await save(page)
  expect(await audit(page)).toEqual([])
})

test("the input is named and described by its field", async ({
  page,
  open,
}) => {
  await open("number-input")
  await expect(quantity(page)).toHaveAccessibleName("Quantity")
  await expect(quantity(page)).toHaveAccessibleDescription("Up to 99.")
  await expect(amount(page)).toHaveAccessibleName("Amount")
})

test("the buttons point at the input they step", async ({ page, open }) => {
  await open("number-input")
  const id = await quantity(page).getAttribute("id")
  await expect(
    page.getByRole("button", { name: "Increase quantity" })
  ).toHaveAttribute("aria-controls", id!)
})

test("the accessibility tree", async ({ page, open }) => {
  await open("number-input")
  await expect(page.getByRole("group").filter({ has: quantity(page) }))
    .toMatchAriaSnapshot(`
    - group:
      - button "Decrease quantity" [disabled]: −
      - textbox "Quantity": "1"
      - button "Increase quantity": +
  `)
})
