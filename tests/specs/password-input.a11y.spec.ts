import AxeBuilder from "@axe-core/playwright"
import { buttonNamed, expect, test } from "../fixtures"
import { passwordInputFixture } from "../fixtures/password-input"

const { password, form } = passwordInputFixture

async function audit(page: import("@playwright/test").Page) {
  // Page structure rules are about the fixture page, not the components.
  const results = await new AxeBuilder({ page })
    .disableRules(["region", "landmark-one-main", "page-has-heading-one"])
    .analyze()
  return results.violations.map(
    (violation) => `${violation.id}: ${violation.help}`
  )
}

test("no axe violations at rest", async ({ page, open }) => {
  await open("password-input")
  expect(await audit(page)).toEqual([])
})

test("no axe violations with the password shown", async ({ page, open }) => {
  await open("password-input")
  await page.getByLabel(password.label, { exact: true }).fill("hunter22")
  await buttonNamed(page, password.toggle).click()
  await expect(buttonNamed(page, password.toggle)).toHaveAttribute(
    "aria-pressed",
    "true"
  )
  expect(await audit(page)).toEqual([])
})

test("no axe violations while disabled", async ({ page, open }) => {
  await open("password-input", { disabled: "" })
  expect(await audit(page)).toEqual([])
})

test("no axe violations while read-only", async ({ page, open }) => {
  await open("password-input", { "read-only": "" })
  expect(await audit(page)).toEqual([])
})

test("the field is named by its label, and the toggle by its aria-label", async ({
  page,
  open,
}) => {
  await open("password-input")
  await expect(
    page.getByRole("textbox", { name: password.label, exact: true })
  ).toBeVisible()
  await expect(buttonNamed(page, password.toggle)).toBeVisible()
})

// Every implementation must expose the same accessibility tree.
test("accessibility tree", async ({ page, open }) => {
  await open("password-input")
  await expect(page.getByRole("form", { name: form.label }))
    .toMatchAriaSnapshot(`
    - form "Sign in":
      - group "Account":
        - textbox "Email"
        - textbox "Password"
        - button "Show password"
      - button "Sign in"
      - button "Reset"
  `)
  await buttonNamed(page, password.toggle).click()
  await expect(page.getByRole("group", { name: form.account }))
    .toMatchAriaSnapshot(`
    - textbox "Password"
    - button "Show password" [pressed]
  `)
})
