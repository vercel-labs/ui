import { expect, type Locator } from "@playwright/test"
import { testExamples, type Check } from "./docs-helpers"

// The newest line in an example's console.
const lastLog = (preview: Locator) =>
  preview
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()

// A radio by its label. Labels with a price or description start with it.
const radio = (preview: Locator, name: string) =>
  preview.getByRole("radio", { name: new RegExp(`^${name}(\\s|$)`) })

// Starts on one radio, clicks another, and checks it took the choice.
const checks =
  (group: string, from: string, to: string): Check =>
  async (preview) => {
    await expect(preview.getByRole("radiogroup", { name: group })).toBeVisible()
    await expect(radio(preview, from)).toBeChecked()
    await radio(preview, to).click()
    await expect(radio(preview, to)).toBeChecked()
    await expect(radio(preview, from)).not.toBeChecked()
  }

// Each example's check, in the order they appear on the Radio page.
testExamples("radio", {
  basic: async (preview) => {
    await checks("Shipping speed", "Standard", "Express")(preview, "")
    // Arrow keys move the selection, and only the checked radio takes Tab.
    await preview.page().keyboard.press("ArrowDown")
    await expect(radio(preview, "Overnight")).toBeChecked()
    await expect(radio(preview, "Overnight")).toBeFocused()
    await expect(radio(preview, "Standard")).toHaveAttribute("tabindex", "-1")
  },
  description: async (preview) => {
    await expect(radio(preview, "Weekly digest")).toHaveAccessibleDescription(
      "A summary every Monday."
    )
    await checks(
      "Email notifications",
      "Daily digest",
      "Weekly digest"
    )(preview, "")
  },
  "choice-card": async (preview) => {
    await expect(radio(preview, "Hobby")).toBeChecked()
    // Clicking the card's text checks its radio.
    await preview.getByText("$20 per month for growing teams.").click()
    await expect(radio(preview, "Pro")).toBeChecked()
    await preview.page().keyboard.press("ArrowDown")
    await expect(radio(preview, "Enterprise")).toBeChecked()
  },
  legend: async (preview) => {
    await expect(
      preview.getByRole("radiogroup", { name: "Billing period" })
    ).toHaveAccessibleDescription("Yearly billing gets you two months free.")
    await checks("Billing period", "Monthly", "Yearly")(preview, "")
  },
  disabled: async (preview) => {
    // A disabled group never changes.
    const dark = radio(preview, "Dark")
    await expect(dark).toBeDisabled()
    await dark.click({ force: true })
    await expect(dark).not.toBeChecked()
    await expect(radio(preview, "Light")).toBeChecked()
    // Arrow keys skip the disabled radio.
    await radio(preview, "Weekly").click()
    await preview.page().keyboard.press("ArrowDown")
    await expect(radio(preview, "Daily")).toBeChecked()
    await expect(radio(preview, "Hourly")).not.toBeChecked()
  },
  "read-only": async (preview) => {
    await radio(preview, "Team").click()
    await expect(radio(preview, "Pro")).toBeChecked()
    await expect(radio(preview, "Team")).not.toBeChecked()
    // Arrow keys move focus without checking.
    await radio(preview, "Pro").focus()
    await preview.page().keyboard.press("ArrowDown")
    await expect(radio(preview, "Team")).toBeFocused()
    await expect(radio(preview, "Pro")).toBeChecked()
  },
  controlled: async (preview) => {
    await radio(preview, "Starter").click()
    await expect(lastLog(preview)).toHaveText("Starter (item-press)")
    await preview.getByRole("button", { name: "Choose Team" }).click()
    await expect(
      radio(preview, "Team"),
      "a controller checks a radio from outside"
    ).toBeChecked()
    await expect(lastLog(preview)).toHaveText("Team (imperative)")
  },
  form: async (preview) => {
    await radio(preview, "Express").click()
    await preview.getByRole("button", { name: "Continue" }).click()
    await expect(lastLog(preview)).toHaveText("Submitted shipping=express")
    await preview.getByRole("button", { name: "Reset" }).click()
    await expect(
      radio(preview, "Standard"),
      "a reset returns to the default"
    ).toBeChecked()
  },
  invalid: async (preview) => {
    const error = preview.getByText("Choose how to get order updates.")
    await expect(error).toBeHidden()
    await preview.getByRole("button", { name: "Save" }).click()
    await expect(error, "saving without a choice shows the error").toBeVisible()
    await radio(preview, "SMS only").click()
    await preview.getByRole("button", { name: "Save" }).click()
    await expect(lastLog(preview)).toHaveText("Saved updates=sms")
  },
  indicator: async (preview) => {
    await checks("Theme", "System", "Light")(preview, "")
    // Kept mounted, the unchecked indicators stay in the page.
    await expect(preview.locator('[data-slot="radio-indicator"]')).toHaveCount(
      3
    )
  },
  render: async (preview) => {
    await expect(radio(preview, "Mentions")).toHaveAccessibleDescription(
      "Only when someone mentions you."
    )
    await checks("Notify me about", "Mentions", "Nothing")(preview, "")
  },
  rtl: async () => {},
})
