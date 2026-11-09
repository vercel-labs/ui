import { expect, type Locator } from "@playwright/test"
import { testExamples, type Check } from "./docs-helpers"

// The field, by its label. A password field has no textbox role, so it's
// found by its name instead.
const field = (preview: Locator, name = "Password") =>
  preview.getByLabel(name, { exact: true })

const toggleOf = (preview: Locator, name = "Show password") =>
  preview.getByRole("button", { name, exact: true })

// Presses the toggle and checks the password shows: the toggle is pressed and
// the field is a text field.
async function show(
  preview: Locator,
  names?: { field: string; toggle: string }
) {
  const toggle = toggleOf(preview, names?.toggle)
  await toggle.click()
  await expect(toggle).toHaveAttribute("aria-pressed", "true")
  await expect(field(preview, names?.field)).toHaveAttribute("type", "text")
}

// Each example's check, in the order they appear on the Password Input page.
// The last line an example logged to the console under its preview.
function lastLog(preview: Locator) {
  return preview
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()
}

const checks: Record<string, Check> = {
  basic: async (preview) => {
    const password = field(preview)
    await password.fill("hunter22")
    await show(preview)
    await expect(password).toHaveValue("hunter22")
    // A press on the toggle leaves focus in the field.
    await expect(password).toBeFocused()
  },
  "new-password": async (preview) => {
    const password = field(preview, "Create a password")
    await password.fill("secret123")
    await expect(password).toHaveAttribute("autocomplete", "new-password")
    const rule = (label: string) =>
      preview.getByRole("listitem").filter({ hasText: label })
    await expect(rule("At least 8 characters")).toContainText("Done:")
    await expect(rule("An uppercase and a lowercase letter")).toContainText(
      "To do:"
    )
  },
  "default-visible": async (preview) => {
    const password = field(preview, "Wi-Fi password")
    const toggle = toggleOf(preview)
    await expect(password).toHaveValue("maple-orbit-42")
    await expect(toggle).toHaveAttribute("aria-pressed", "true")
    await expect(password).toHaveAttribute("type", "text")
    await toggle.click()
    await expect(toggle).toHaveAttribute("aria-pressed", "false")
    await expect(password).toHaveAttribute("type", "password")
  },
  "caps-lock": async (preview) => {
    const password = field(preview)
    await password.fill("hunter22")
    await expect(password).toHaveValue("hunter22")
    // Caps Lock is off, so the warning stays hidden.
    await expect(
      preview.getByText("Caps Lock is on.", { exact: true })
    ).toBeHidden()
  },
  disabled: async (preview) => {
    await expect(field(preview)).toHaveValue("hunter22")
    await expect(field(preview)).toBeDisabled()
    await expect(toggleOf(preview)).toBeDisabled()
  },
  "read-only": async (preview) => {
    const key = field(preview, "Recovery key")
    await key.pressSequentially("x")
    await expect(key).toHaveValue("7Hq2-vX9p-Lm4c")
    await show(preview, { field: "Recovery key", toggle: "Show recovery key" })
  },
  controlled: async (preview) => {
    await show(preview)
    await expect(lastLog(preview)).toHaveText("Shown (toggle-press)")
  },
  controller: async (preview) => {
    const password = field(preview, "New password")
    await preview.getByRole("button", { name: "Suggest", exact: true }).click()
    await expect(password).toHaveValue("plum-kettle-orbit-42")
    await expect(toggleOf(preview)).toHaveAttribute("aria-pressed", "true")
    await expect(password).toHaveAttribute("type", "text")
    await preview.getByRole("button", { name: "Read", exact: true }).click()
    await expect(lastLog(preview)).toHaveText("20 characters, shown")
    await preview.getByRole("button", { name: "Clear", exact: true }).click()
    await expect(password).toHaveValue("")
  },
  form: async (preview) => {
    const password = field(preview)
    await field(preview, "Email").fill("hollis@example.com")
    await password.fill("hunter22")
    await show(preview)
    // Enter in the field submits, since the toggle is type="button".
    await password.press("Enter")
    await expect(lastLog(preview)).toHaveText(
      "Signed in as hollis@example.com, with a password of 8 characters"
    )
    // Submitting hid the password again.
    await expect(toggleOf(preview)).toHaveAttribute("aria-pressed", "false")
    await expect(password).toHaveAttribute("type", "password")
    await preview.getByRole("button", { name: "Reset" }).click()
    await expect(password).toHaveValue("")
  },
}

testExamples("password-input", checks, "components", [
  ...Object.keys(checks),
  "render",
  "rtl",
  "value",
])
