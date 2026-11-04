import { expect, type Locator } from "@playwright/test"
import { testExamples, type Check } from "./docs-helpers"

// The newest line in an example's console.
const lastLog = (preview: Locator) =>
  preview
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()

// Focuses a code's input and types into it, as a person would.
async function type(preview: Locator, name: string, text: string) {
  const input = preview.getByRole("textbox", { name, exact: true })
  await input.focus()
  await input.page().keyboard.type(text)
  return input
}

// Each example's check, in the order they appear on the OTP Input page.
const checks: Record<string, Check> = {
  basic: async (preview) => {
    const input = await type(preview, "Verification code", "123456")
    await expect(input).toHaveValue("123456")
    // The slots draw the code.
    await expect(preview.getByText("6", { exact: true })).toBeVisible()
  },
  "four-digits": async (preview) => {
    // The last slot stays selected once the code is full, so a fifth digit
    // replaces the fourth.
    await expect(await type(preview, "PIN", "12345")).toHaveValue("1235")
  },
  alphanumeric: async (preview) => {
    await expect(await type(preview, "Recovery code", "ab12-cd34")).toHaveValue("ab12cd34")
  },
  pattern: async (preview) => {
    await expect(await type(preview, "Device code", "12zzab")).toHaveValue("12ab")
  },
  invalid: async (preview) => {
    const input = preview.getByRole("textbox", { name: "Verification code" })
    await expect(input).toHaveValue("482913")
    await expect(input).toHaveAttribute("aria-invalid", "true")
    await expect(input).toHaveAccessibleDescription("That code has expired. Request a new one.")
    // Editing the code clears the error.
    await input.focus()
    await input.press("Backspace")
    await expect(input).not.toHaveAttribute("aria-invalid", "true")
    await expect(preview.getByText("That code has expired.")).toBeHidden()
  },
  controlled: async (preview) => {
    const input = await type(preview, "One-time password", "12")
    await expect(input).toHaveValue("12")
    await expect(lastLog(preview)).toHaveText("12 (input-change)")
  },
  complete: async (preview) => {
    await type(preview, "Verification code", "123456")
    await expect(lastLog(preview)).toHaveText("Checking 123456 (input-change)")
  },
  form: async (preview) => {
    await type(preview, "Verification code", "123456")
    await preview.getByRole("button", { name: "Verify" }).click()
    await expect(lastLog(preview)).toHaveText("Submitted code=123456, recovery=")
    await preview.getByRole("button", { name: "Reset" }).click()
    await expect(preview.getByRole("textbox", { name: "Verification code" })).toHaveValue("")
  },
}

// Every check reads its own example, since each example's Code panel stays mounted.
const scoped = Object.fromEntries(
  Object.entries(checks).map(([name, check]): [string, Check] => [
    name,
    (preview, framework) => check(preview.page().locator(`[data-example="otp-input/${name}"]`), framework),
  ]),
)

testExamples("otp-input", scoped, "components", [...Object.keys(checks), "render", "rtl", "separator"])
