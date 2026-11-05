import { expect } from "@playwright/test"
import { testExamples } from "./docs-helpers"

// Each example's check, in the order they appear on the Image Cropper page.
testExamples("image-cropper", {
  basic: async (preview) => {
    const selection = preview.getByRole("slider", { name: "Crop" })
    await expect(selection).toHaveAttribute("aria-valuetext", "640 by 420 pixels, at 0, 0")
    await preview.getByRole("slider", { name: "Bottom right corner" }).press("Shift+ArrowLeft")
    await expect(selection).not.toHaveAttribute("aria-valuetext", "640 by 420 pixels, at 0, 0")
  },
  "aspect-ratio": async (preview) => {
    await preview.getByRole("button", { name: "Square" }).click()
    await expect(preview.getByRole("slider", { name: "Crop" })).toHaveAttribute(
      "aria-valuetext",
      "420 by 420 pixels, at 110, 0",
    )
  },
  avatar: async (preview) => {
    await preview.getByRole("slider", { name: "Zoom" }).fill("2")
    await preview.getByRole("button", { name: "Save Avatar" }).click()
    await expect(preview.getByRole("img", { name: "Your new avatar" })).toBeVisible()
  },
})
