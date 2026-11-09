import { expect } from "@playwright/test"
import { testExamples } from "./docs-helpers"

// Each example's check, in the order they appear on the Meter page.
testExamples(
  "meter",
  {
    basic: async (preview) => {
      await expect(
        preview.getByRole("meter", { name: "Storage used" })
      ).toHaveAttribute("aria-valuenow", "68")
    },
    "min-max": async (preview) => {
      const meter = preview.getByRole("meter")
      await expect(meter).toHaveAttribute("aria-valuenow", "720")
      await expect(meter).toHaveAttribute("aria-valuemin", "300")
      await expect(preview.getByText("720", { exact: true })).toBeVisible()
    },
    format: async (preview) => {
      await expect(preview.getByText("120 GB")).toBeVisible()
      await expect(preview.getByText("$1,840")).toBeVisible()
      await expect(preview.getByText("18 of 25 seats")).toBeVisible()
    },
    "value-label": async (preview) => {
      await expect(preview.getByRole("meter")).toHaveAttribute(
        "aria-valuetext",
        "750 of 1000 requests, 75%"
      )
    },
  },
  "components",
  ["basic", "label", "rtl", "min-max", "format", "value-label", "render"]
)
