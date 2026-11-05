import { expect } from "@playwright/test"
import { testExamples } from "./docs-helpers"

// Each example's check, in the order they appear on the Rating page.
testExamples("rating", {
  basic: async (preview) => {
    await expect(preview.getByRole("radio", { name: "3 stars" })).toBeChecked()
    await preview.getByRole("radio", { name: "4 stars" }).click()
    await preview.getByRole("radio", { name: "4 stars" }).press("ArrowRight")
    await expect(preview.getByRole("radio", { name: "5 stars" })).toBeChecked()
  },
  "half-stars": async (preview) => {
    await expect(preview.getByRole("radio", { name: "3.5 stars" })).toBeChecked()
    await preview.getByRole("radio", { name: "1.5 stars" }).click()
    await expect(preview.getByRole("radio", { name: "1.5 stars" })).toBeChecked()
  },
  deselectable: async (preview) => {
    await preview.getByRole("radio", { name: "4 stars" }).click()
    await expect(preview.getByRole("radio", { checked: true })).toHaveCount(0)
  },
  "read-only": async (preview) => {
    await expect(preview.getByRole("img", { name: "Rated 4.2 out of 5" })).toBeVisible()
    await expect(preview.getByRole("radio")).toHaveCount(0)
  },
  disabled: async (preview) => {
    await expect(preview.getByRole("radiogroup", { name: "Rating" })).toHaveAttribute("aria-disabled", "true")
  },
  controlled: async (preview) => {
    await expect(preview.getByRole("radio", { name: "4 stars" })).toBeChecked()
    await preview.getByRole("button", { name: "Clear Rating" }).click()
    await expect(preview.getByRole("radio", { checked: true })).toHaveCount(0)
  },
  form: async (preview) => {
    const group = preview.getByRole("radiogroup", { name: "Rate your stay" })
    await expect(group).toBeVisible()
    await group.getByRole("radio", { name: "2 stars" }).click()
    await preview.getByRole("button", { name: "Reset" }).click()
    await expect(group.getByRole("radio", { checked: true })).toHaveCount(0)
  },
})
