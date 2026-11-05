import { expect } from "@playwright/test"
import { testExamples } from "./docs-helpers"

// Each example's check, in the order they appear on the Segmented Control page.
testExamples("segmented-control", {
  basic: async (preview) => {
    const grid = preview.getByRole("radio", { name: "Grid" })
    await grid.click()
    await expect(grid).toBeChecked()
    await grid.press("ArrowRight")
    await expect(preview.getByRole("radio", { name: "Board" })).toBeChecked()
  },
  vertical: async (preview) => {
    await expect(preview.getByRole("radiogroup", { name: "Vertical alignment" })).toHaveAttribute(
      "aria-orientation",
      "vertical",
    )
    await preview.getByRole("radio", { name: "Bottom" }).click()
    await preview.getByRole("radio", { name: "Bottom" }).press("ArrowUp")
    await expect(preview.getByRole("radio", { name: "Middle" })).toBeChecked()
  },
  disabled: async (preview) => {
    await expect(preview.getByRole("radio", { name: "Light" })).toBeDisabled()
    await preview.getByRole("radio", { name: "Yearly" }).click()
    await preview.getByRole("radio", { name: "Yearly" }).press("ArrowRight")
    await expect(preview.getByRole("radio", { name: "Monthly" })).toBeChecked()
  },
  controlled: async (preview) => {
    await preview.getByRole("button", { name: "Show Month" }).click()
    await expect(preview.getByRole("radio", { name: "Month" })).toBeChecked()
  },
  form: async (preview) => {
    await expect(preview.getByRole("radiogroup", { name: "Billing period" })).toBeVisible()
    await preview.getByRole("radio", { name: "Yearly" }).click()
    await preview.getByRole("button", { name: "Reset" }).click()
    await expect(preview.getByRole("radio", { name: "Monthly" })).toBeChecked()
  },
})
