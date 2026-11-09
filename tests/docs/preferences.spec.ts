import { expect, type Locator } from "@playwright/test"
import { testExamples } from "./docs-helpers"

// The last line an example logged to the console under its preview.
function lastLog(preview: Locator) {
  return preview
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()
}

testExamples("preferences", {
  basic: async (preview) => {
    const page = preview.page()
    await page.evaluate(() =>
      localStorage.removeItem("ui-sdk-preferences-view")
    )
    const grid = preview.getByRole("button", { name: "Grid", exact: true })
    await grid.click()
    await expect(grid).toHaveAttribute("aria-pressed", "true")
    await expect(preview.locator('[data-view="grid"]')).toHaveCount(1)
    await expect(lastLog(preview)).toHaveText("Saved the grid view")
    await preview.getByRole("button", { name: "List", exact: true }).click()
    await expect(preview.locator('[data-view="list"]')).toHaveCount(1)
  },
})
