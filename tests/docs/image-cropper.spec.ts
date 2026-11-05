import { expect } from "@playwright/test"
import { testExamples } from "./docs-helpers"

// Each example's check, in the order they appear on the Image Cropper page.
testExamples("image-cropper", {
  basic: async (preview) => {
    const selection = preview.getByRole("slider", { name: "Crop" })
    await expect(selection).toHaveAttribute("aria-valuetext", "512 by 336 pixels, at 64, 42")
    await preview.getByRole("combobox", { name: "Aspect ratio" }).click()
    await preview.getByRole("option", { name: "Square" }).click()
    await expect(selection).toHaveAttribute("aria-valuetext", "336 by 336 pixels, at 152, 42")
    await preview.getByRole("button", { name: "Crop", exact: true }).click()
    await expect(preview.getByRole("img", { name: "Your crop" })).toBeVisible()
  },
  "aspect-ratio": async (preview) => {
    await preview.getByRole("button", { name: "Square" }).click()
    await expect(preview.getByRole("slider", { name: "Crop" })).toHaveAttribute(
      "aria-valuetext",
      "336 by 336 pixels, at 152, 42",
    )
  },
  avatar: async (preview) => {
    await preview.getByRole("slider", { name: "Zoom" }).fill("2")
    await preview.getByRole("button", { name: "Save Avatar" }).click()
    await expect(preview.getByRole("img", { name: "Your new avatar" })).toBeVisible()
  },
})
