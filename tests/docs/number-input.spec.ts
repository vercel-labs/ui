import { expect, type Locator } from "@playwright/test"
import { testExamples, type Check } from "./docs-helpers"

// The newest line in an example's console.
const lastLog = (preview: Locator) =>
  preview
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()

const input = (preview: Locator, name: string) => preview.getByRole("textbox", { name, exact: true })
const button = (preview: Locator, name: string) => preview.getByRole("button", { name, exact: true })

// Checks a field's starting text, then presses its first Increase button and checks the new text.
const steps =
  (name: string, from: string | RegExp, to: string | RegExp): Check =>
  async (preview) => {
    await expect(input(preview, name)).toHaveValue(from)
    await button(preview, "Increase").first().click()
    await expect(input(preview, name)).toHaveValue(to)
  }

// Each example's check, in the order they appear on the Number Input page.
const checks: Record<string, Check> = {
  basic: async (preview) => {
    await steps("Quantity", "1", "2")(preview, "")
    await expect(lastLog(preview)).toHaveText("Quantity 2")
  },
  field: steps("Tickets", "2", "3"),
  "min-max": async (preview) => {
    const guests = input(preview, "Guests")
    await guests.focus()
    await guests.press("ArrowUp")
    await expect(guests).toHaveValue("3")
    await guests.press("ArrowDown")
    await guests.press("ArrowDown")
    await expect(guests).toHaveValue("1")
    await expect(button(preview, "Decrease")).toBeDisabled()
  },
  step: steps("Hours", "1.5", "1.75"),
  format: steps("Price", "$19.99", "$20.00"),
  locale: steps("Preis", /^1\.234,50\s€$/, /^1\.234,51\s€$/),
  wheel: steps("Font size", "16", "17"),
  scrub: async (preview) => {
    await expect(preview.getByRole("group", { name: "Frame" })).toBeVisible()
    await expect(input(preview, "X position")).toHaveValue("120")
    await expect(input(preview, "Height")).toHaveValue("240")
    await expect(preview.getByText("W", { exact: true })).toHaveAttribute("aria-hidden", "true")
  },
  controlled: async (preview) => {
    await steps("Servings", "4", "5")(preview, "")
    await expect(lastLog(preview)).toHaveText("Committed 5 (increment-press)")
    await button(preview, "Clear").click()
    await expect(input(preview, "Servings")).toHaveValue("")
    await button(preview, "Reset to 4").click()
    await expect(input(preview, "Servings")).toHaveValue("4")
  },
  controller: async (preview) => {
    const zoom = input(preview, "Zoom")
    await expect(zoom).toHaveValue("100%")
    await button(preview, "Zoom In").click()
    await expect(zoom).toHaveValue("200%")
    await button(preview, "Actual Size").click()
    await expect(zoom).toHaveValue("100%")
    await button(preview, "Read").click()
    await expect(lastLog(preview)).toHaveText("Zoom is 100%")
  },
  form: async (preview) => {
    await steps("Quantity", "2", "3")(preview, "")
    // Gift cards submits with the form through its form ID.
    await button(preview, "Save").click()
    await expect(lastLog(preview)).toHaveText("Submitted quantity=3, tip=4.5, gift-cards=0")
    await button(preview, "Reset").click()
    await expect(input(preview, "Quantity")).toHaveValue("2")
  },
  render: async (preview) => {
    const temperature = input(preview, "Temperature")
    await expect(temperature).toHaveValue(/^-2\s?°C$/)
    await temperature.press("End")
    await expect(temperature).toHaveValue(/^40\s?°C$/)
    await expect(button(preview, "Warmer")).toHaveText("Max")
  },
}

testExamples("number-input", checks, "components", [...Object.keys(checks), "buttons", "rtl"])
