import { expect, test } from "@playwright/test"
import { readdirSync } from "node:fs"
import path from "node:path"

const frameworks = ["react", "vue", "svelte", "web-components", "solid"]
// Every framework folder must have the same examples.
const root = path.join(import.meta.dirname, "../../examples/components/separator")
const folders = ["react", "vue", "svelte", "web", "solid"]
const examplesIn = (folder: string) =>
  readdirSync(path.join(root, folder), { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name.replace(/\.\w+$/, ""))

// The order examples appear on the Separator page, how many separators screen
// readers find in each, and how many of those are vertical. The decorative
// example's lines are hidden from them.
const separators: Record<string, { count: number; vertical: number }> = {
  basic: { count: 1, vertical: 0 },
  vertical: { count: 2, vertical: 2 },
  decorative: { count: 0, vertical: 0 },
}
const order = Object.keys(separators)
const fixtures = [...order, "menu", "list", "rtl"]

for (const framework of frameworks) {
  test(`every separator example works in ${framework}`, async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
    await page.goto(`/docs/${framework}/components/separator`)
    const previews = page.locator("[data-example]")
    await expect(previews).toHaveCount(order.length)
    for (const folder of folders) expect(examplesIn(folder).sort(), folder).toEqual([...fixtures].sort())

    for (const [index, name] of order.entries()) {
      const { count, vertical } = separators[name]
      const preview = previews.nth(index)
      await expect(preview.getByRole("separator"), name).toHaveCount(count)
      // Every framework sets aria-orientation.
      await expect(preview.locator('[role="separator"][aria-orientation="vertical"]'), name).toHaveCount(
        vertical,
      )
    }

    // The rows are text, not links that would rewrite the docs' URL.
    for (const name of ["basic", "vertical"])
      await expect(previews.nth(order.indexOf(name)).getByRole("link")).toHaveCount(0)

    // The decorative lines are there, just hidden from screen readers.
    const decorative = previews.nth(order.indexOf("decorative"))
    await expect(decorative.getByText("or", { exact: true })).toBeVisible()
    await expect(decorative.locator('[role="none"], [role="presentation"]')).toHaveCount(2)

    expect(errors).toEqual([])
  })
}
