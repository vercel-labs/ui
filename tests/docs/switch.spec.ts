import { expect, type Locator } from "@playwright/test"
import { testExamples, type Check } from "./docs-helpers"

// The newest line in an example's console.
const lastLog = (preview: Locator) =>
  preview
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()

const switchNamed = (preview: Locator, name: string) => preview.getByRole("switch", { name, exact: true })

// Clicks a switch, then presses Space on it, and checks each turns it over.
const toggles =
  (name: string, from = false): Check =>
  async (preview) => {
    const control = switchNamed(preview, name)
    await expect(control).toHaveAttribute("aria-checked", String(from))
    await control.click()
    await expect(control).toHaveAttribute("aria-checked", String(!from))
    await control.press("Space")
    await expect(control).toHaveAttribute("aria-checked", String(from))
  }

// Each example's check, in the order they appear on the Switch page.
const checks: Record<string, Check> = {
  basic: toggles("Airplane mode"),
  description: async (preview) => {
    await expect(switchNamed(preview, "Weekly digest")).toHaveAccessibleDescription(
      "A summary of your week, every Monday.",
    )
    await toggles("Weekly digest")(preview, "")
  },
  "choice-card": async (preview) => {
    const profile = switchNamed(preview, "Public profile")
    await expect(profile).toHaveAttribute("aria-checked", "false")
    // The label covers its card, so a click anywhere on the card toggles the switch.
    await preview.locator('[data-variant="card"]').filter({ hasText: "Public profile" }).click()
    await expect(profile).toHaveAttribute("aria-checked", "true")
    await expect(switchNamed(preview, "Show activity status")).toHaveAttribute("aria-checked", "true")
  },
  disabled: async (preview) => {
    await toggles("Product updates")(preview, "")
    const alerts = switchNamed(preview, "Security alerts")
    await expect(alerts).toBeDisabled()
    await alerts.click({ force: true })
    await expect(alerts).toHaveAttribute("aria-checked", "true")
  },
  "read-only": async (preview) => {
    const encrypt = switchNamed(preview, "Encrypt backups")
    await encrypt.click()
    await expect(encrypt).toBeFocused()
    await encrypt.press("Space")
    await expect(encrypt).toHaveAttribute("aria-checked", "true")
  },
  controlled: async (preview) => {
    const wifi = switchNamed(preview, "Wi-Fi")
    await wifi.click()
    await expect(wifi).toHaveAttribute("aria-checked", "false")
    await expect(lastLog(preview)).toHaveText("Off (press)")
    await preview.getByRole("button", { name: "Toggle", exact: true }).click()
    await expect(wifi).toHaveAttribute("aria-checked", "true")
    await expect(lastLog(preview)).toHaveText("On (imperative)")
  },
  form: async (preview) => {
    await switchNamed(preview, "Product updates").click()
    await preview.getByRole("button", { name: "Save" }).click()
    await expect(lastLog(preview)).toHaveText("Submitted updates=on&security=on&digest=weekly")
    await preview.getByRole("button", { name: "Reset" }).click()
    await expect(switchNamed(preview, "Product updates")).toHaveAttribute("aria-checked", "false")
    await expect(switchNamed(preview, "Weekly digest")).toHaveAttribute("aria-checked", "true")
  },
  invalid: async (preview) => {
    const twoFactor = switchNamed(preview, "Two-factor authentication")
    await preview.getByRole("button", { name: "Continue" }).click()
    await expect(preview.getByText("Turn this on to continue.")).toBeVisible()
    await expect(twoFactor).toHaveAttribute("aria-invalid", "true")
    await twoFactor.click()
    await expect(preview.getByText("Turn this on to continue.")).toBeHidden()
    await preview.getByRole("button", { name: "Continue" }).click()
    await expect(lastLog(preview)).toHaveText("Submitted two-factor=on")
  },
  async: async (preview) => {
    const backups = switchNamed(preview, "Automatic backups")
    await backups.click()
    // The switch keeps its value while the save runs.
    await expect(backups).toHaveAttribute("aria-busy", "true")
    await expect(backups).toHaveAttribute("aria-checked", "false")
    await expect(lastLog(preview)).toHaveText("Saving…")
    await expect(backups).toHaveAttribute("aria-checked", "true")
    await expect(lastLog(preview)).toHaveText("Saved: on")
  },
  render: async (preview) => {
    await toggles("Dark mode")(preview, "")
    await expect(preview.locator('[data-slot="switch-thumb"] svg')).toHaveCount(1)
  },
}

// Every check reads its own example, since each example's Code panel stays mounted.
const scoped = Object.fromEntries(
  Object.entries(checks).map(([name, check]): [string, Check] => [
    name,
    (preview, framework) => check(preview.page().locator(`[data-example="switch/${name}"]`), framework),
  ]),
)

testExamples("switch", scoped, "components", [...Object.keys(checks), "rtl", "size"])
