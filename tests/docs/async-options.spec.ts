import { expect } from "@playwright/test"
import { test } from "./docs-test"
import { docsFolder, frameworks } from "./docs-helpers"

// The page shows Combobox's async examples, which combobox.spec.ts exercises.
for (const framework of frameworks) {
  test(`the async options page renders in ${framework}`, async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
    await page.goto(`/docs/${framework}/${docsFolder(framework, "utilities")}/async-options`)
    await expect(page.locator("[data-example]")).toHaveCount(2)
    await expect(page.getByRole("heading", { name: "Retry a Search" })).toBeVisible()
    expect(errors).toEqual([])
  })
}
