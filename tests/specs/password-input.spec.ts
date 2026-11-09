import { buttonNamed, expect, lastAction, test } from "../fixtures"
import {
  passwordInputAction,
  passwordInputFixture,
} from "../fixtures/password-input"

// A password field with a show and hide button. There is no APG pattern for
// it; the toggle follows the button pattern's toggle button:
// https://www.w3.org/WAI/ARIA/apg/patterns/button/

const { password, form } = passwordInputFixture
const field = (page: import("@playwright/test").Page) =>
  page.getByLabel(password.label, { exact: true })
const toggle = (page: import("@playwright/test").Page) =>
  buttonNamed(page, password.toggle)

test.beforeEach(async ({ open }) => {
  await open("password-input")
})

test("the field is a password field named by its label and described by its description", async ({
  page,
}) => {
  await expect(field(page)).toHaveAttribute("type", "password")
  await expect(field(page)).toHaveAccessibleDescription(password.description)
})

test("the toggle is a button that says what it does, and isn't pressed", async ({
  page,
}) => {
  await expect(toggle(page)).toHaveAttribute("aria-pressed", "false")
  await expect(toggle(page)).toHaveAttribute("type", "button")
})

test("pressing the toggle shows the password, and pressing it again hides it", async ({
  page,
}) => {
  await field(page).fill("hunter22")
  await toggle(page).click()
  await expect(field(page)).toHaveAttribute("type", "text")
  await expect(toggle(page)).toHaveAttribute("aria-pressed", "true")
  expect(await lastAction(page)).toBe(
    passwordInputAction.visible(true, "toggle-press")
  )
  await toggle(page).click()
  await expect(field(page)).toHaveAttribute("type", "password")
  await expect(toggle(page)).toHaveAttribute("aria-pressed", "false")
  await expect(field(page)).toHaveValue("hunter22")
})

for (const key of [" ", "Enter"]) {
  test(`${key === " " ? "Space" : key} on the focused toggle shows the password and keeps focus on the toggle`, async ({
    page,
  }) => {
    await toggle(page).focus()
    await page.keyboard.press(key)
    await expect(field(page)).toHaveAttribute("type", "text")
    await expect(toggle(page)).toBeFocused()
  })
}

test("the toggle keeps its name when the password shows", async ({ page }) => {
  await toggle(page).click()
  await expect(toggle(page)).toHaveAttribute("aria-pressed", "true")
})

test("Enter in the field submits the form, and never presses the toggle", async ({
  page,
}) => {
  await field(page).fill("hunter22")
  await field(page).press("Enter")
  await expect(page.getByRole("status", { name: "Last action" })).toHaveText(
    passwordInputAction.submit("password")
  )
  await expect(toggle(page)).toHaveAttribute("aria-pressed", "false")
})

test("the password submits under its name", async ({ page }) => {
  await field(page).fill("hunter22")
  const data = await page
    .getByRole("form", { name: form.label })
    .evaluate((el) => Object.fromEntries(new FormData(el as HTMLFormElement)))
  expect(data[password.name]).toBe("hunter22")
})

test("the password can start shown", async ({ page, open }) => {
  await open("password-input", { "default-visible": "" })
  await expect(field(page)).toHaveAttribute("type", "text")
  await expect(toggle(page)).toHaveAttribute("aria-pressed", "true")
})

test("a change can be canceled", async ({ page, open }) => {
  await open("password-input", { cancel: "" })
  await toggle(page).click()
  await expect(field(page)).toHaveAttribute("type", "password")
  await expect(toggle(page)).toHaveAttribute("aria-pressed", "false")
})

test("a disabled password input disables the field and the toggle", async ({
  page,
  open,
}) => {
  await open("password-input", { disabled: "" })
  await expect(field(page)).toBeDisabled()
  await expect(toggle(page)).toBeDisabled()
})

test("a read-only field can still be shown", async ({ page, open }) => {
  await open("password-input", { "read-only": "" })
  await expect(field(page)).toHaveAttribute("readonly", "")
  await toggle(page).click()
  await expect(field(page)).toHaveAttribute("type", "text")
})

test("the controller shows and hides the password", async ({ page }) => {
  await buttonNamed(page, passwordInputFixture.controller).click()
  await expect(field(page)).toHaveAttribute("type", "text")
  expect(await lastAction(page)).toBe(
    passwordInputAction.visible(true, "imperative")
  )
  await buttonNamed(page, passwordInputFixture.controller).click()
  await expect(field(page)).toHaveAttribute("type", "password")
})

test("a controlled password input follows its owner", async ({
  page,
  open,
  framework,
}) => {
  test.skip(framework.startsWith("web"), "Web components own their state.")
  await open("password-input", { controlled: "" })
  await toggle(page).click()
  await expect(field(page)).toHaveAttribute("type", "text")
  await toggle(page).click()
  await expect(field(page)).toHaveAttribute("type", "password")
})

test("a click with no pointer behind it, like a screen reader's, shows the password", async ({
  page,
}) => {
  await toggle(page).focus()
  await toggle(page).evaluate((el) => (el as HTMLElement).click())
  await expect(field(page)).toHaveAttribute("type", "text")
  await expect(toggle(page)).toBeFocused()
})
