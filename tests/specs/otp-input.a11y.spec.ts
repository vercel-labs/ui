import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "../fixtures"
import { focusCode } from "./otp-input.helpers"

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
  await open("otp-input")
  expect(await audit(page)).toEqual([])
})

test("no axe violations while typing", async ({ page, open }) => {
  await open("otp-input")
  await focusCode(page)
  await page.keyboard.type("123")
  expect(await audit(page)).toEqual([])
})

test("no axe violations when disabled", async ({ page, open }) => {
  await open("otp-input", { disabled: "" })
  expect(await audit(page)).toEqual([])
})
