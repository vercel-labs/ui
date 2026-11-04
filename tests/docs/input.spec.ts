import { expect, type Locator } from "@playwright/test"
import { testExamples } from "./docs-helpers"

// The newest line in an example's console.
const lastLog = (preview: Locator) =>
  preview
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()

testExamples(
  "input",
  {
    basic: async (preview) => {
      const website = preview.getByLabel("Website", { exact: true })
      await expect(website).toHaveValue("hollisgrant.com")
      await preview.getByRole("button", { name: "Clear website" }).click()
      await expect(website).toHaveValue("")
      await expect(website).toBeFocused()
      await expect(preview.getByRole("button", { name: "Clear website" })).toBeHidden()
      await expect(lastLog(preview)).toHaveText("Empty (clear-press)")
      await website.pressSequentially("hollis.dev")
      await expect(preview.getByRole("button", { name: "Clear website" })).toBeVisible()
    },
  },
  "components",
  ["basic", "rtl"],
)
