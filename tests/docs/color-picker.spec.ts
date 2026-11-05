import { expect } from "@playwright/test"
import { testExamples } from "./docs-helpers"

// Each example's check, in the order they appear on the Color Picker page.
testExamples("color-picker", {
  basic: async (preview) => {
    const input = preview.getByRole("textbox", { name: "Hex" })
    await expect(input).toHaveValue("#0ea5e9")
    await input.fill("rebeccapurple")
    await input.press("Enter")
    await expect(input).toHaveValue("#663399")
  },
  oklch: async (preview) => {
    await expect(preview.getByRole("slider", { name: "Chroma and lightness" })).toBeVisible()
    await expect(preview.getByRole("textbox", { name: "OKLCH" })).toHaveValue("oklch(0.62 0.19 259)")
  },
  swatches: async (preview) => {
    await preview.getByRole("option", { name: "vivid red" }).click()
    await expect(preview.getByRole("option", { name: "vivid red" })).toHaveAttribute("aria-selected", "true")
    await expect(preview.getByRole("spinbutton", { name: "Red" })).toHaveValue("239")
  },
  popover: async (preview) => {
    await preview.getByRole("button", { name: "Background" }).click()
    await expect(preview.getByRole("textbox", { name: "Hex" })).toHaveValue("#22c55e")
  },
  disabled: async (preview) => {
    await expect(preview.getByRole("slider", { name: "Hue" })).toHaveAttribute("aria-disabled", "true")
  },
  controlled: async (preview) => {
    await preview.getByRole("button", { name: "Use Purple" }).click()
    await expect(preview.getByRole("textbox", { name: "Hex" })).toHaveValue("#663399")
  },
  form: async (preview) => {
    await expect(preview.getByRole("group", { name: "Brand color" })).toBeVisible()
    await preview.getByRole("slider", { name: "Hue" }).press("End")
    await preview.getByRole("button", { name: "Reset" }).click()
    await expect(preview.getByRole("slider", { name: "Hue" })).toHaveAttribute(
      "aria-valuetext",
      /^2[45] degrees$/,
    )
  },
})
