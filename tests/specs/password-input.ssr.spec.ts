import { buttonNamed, expect, test } from "../fixtures"
import { passwordInputFixture } from "../fixtures/password-input"

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const hydrationErrors = (page: import("@playwright/test").Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors
  )

const { password } = passwordInputFixture

test("a password input hydrates without mismatches and works", async ({
  page,
  open,
}) => {
  await open("password-input")
  await page.waitForLoadState("networkidle")
  const field = page.getByLabel(password.label, { exact: true })
  await field.fill("hunter22")
  await buttonNamed(page, password.toggle).click()
  await expect(field).toHaveAttribute("type", "text")
  expect(await hydrationErrors(page)).toEqual([])
})

test("the server renders a password field, or a shown one", async ({
  page,
  open,
}) => {
  await open("password-input")
  await expect(
    page.getByLabel(password.label, { exact: true })
  ).toHaveAttribute("type", "password")
  await open("password-input", { "default-visible": "" })
  await expect(
    page.getByLabel(password.label, { exact: true })
  ).toHaveAttribute("type", "text")
  await expect(buttonNamed(page, password.toggle)).toHaveAttribute(
    "aria-pressed",
    "true"
  )
  expect(await hydrationErrors(page)).toEqual([])
})
