import { expect } from "@playwright/test"
import { testExamples } from "./docs-helpers"

// Each example's check, in the order they appear on the Label page.
testExamples("label", {
  basic: async (preview) => {
    await preview.getByText("Shipping speed", { exact: true }).click()
    await expect(preview.getByRole("radiogroup", { name: "Shipping speed" })).toBeVisible()
    await expect(preview.getByRole("radio", { name: "Standard" })).toBeFocused()
  },
  slider: async (preview) => {
    await preview.getByText("Volume", { exact: true }).click()
    await expect(preview.getByRole("slider", { name: "Volume" })).toBeFocused()
  },
  switch: async (preview) => {
    await preview.getByText("Email me product updates", { exact: true }).click()
    await expect(preview.getByRole("switch", { name: "Email me product updates" })).toBeChecked()
  },
  wrap: async (preview) => {
    await preview.getByText("Accept terms and conditions", { exact: true }).click()
    await expect(preview.getByRole("checkbox", { name: "Accept terms and conditions" })).toBeChecked()
  },
})
