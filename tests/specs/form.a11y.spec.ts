import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "../fixtures"
import { group, save, textbox } from "./form.helpers"

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
  await open("form")
  await expect(textbox(page, "Username")).toBeVisible()
  expect(await audit(page)).toEqual([])
})

test("no axe violations with errors showing", async ({ page, open }) => {
  await open("form")
  await save(page)
  await expect(textbox(page, "Username")).toHaveAttribute(
    "aria-invalid",
    "true"
  )
  expect(await audit(page)).toEqual([])
})

test("no axe violations with errors from the server and a clear button", async ({
  page,
  open,
}) => {
  await open("form", { errors: "" })
  await textbox(page, "Website").fill("example.com")
  await expect(page.getByText("This email bounced.")).toBeVisible()
  expect(await audit(page)).toEqual([])
})

test("no axe violations in a disabled fieldset", async ({ page, open }) => {
  await open("form", { disabled: "" })
  await expect(textbox(page, "Username")).toBeDisabled()
  expect(await audit(page)).toEqual([])
})

test("required inputs are announced as required", async ({ page, open }) => {
  await open("form")
  await expect(textbox(page, "Username")).toHaveJSProperty("required", true)
})

// Every implementation must expose the same accessibility tree. Descriptions
// are custom elements on the web, so the tree lists the named parts.
test("accessibility tree", async ({ page, open }) => {
  await open("form")
  await expect(group(page, "Profile")).toMatchAriaSnapshot(`
    - group "Profile":
      - textbox "Username"
      - textbox "Bio"
  `)
  await expect(group(page, "Contact")).toMatchAriaSnapshot(`
    - group "Contact":
      - textbox "Email": ada@example.com
      - textbox "Website"
  `)
})
