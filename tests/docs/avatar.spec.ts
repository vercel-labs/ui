import { expect } from "@playwright/test"
import { testExamples } from "./docs-helpers"

// Each example's check, in the order they appear on the Avatar page. The
// helper serves the GitHub avatar locally, so images load without a network.
testExamples(
  "avatar",
  {
    basic: async (preview) => {
      await expect(preview.getByRole("img", { name: "shadcn" })).toBeVisible()
      await expect(preview.getByText("CN", { exact: true })).toBeHidden()
    },
  },
  "components",
  ["basic", "rtl"],
)
