import { expect, test } from "@playwright/test"
import { readdirSync } from "node:fs"
import path from "node:path"

const frameworks = ["react", "vue", "svelte", "web-components", "solid"]
// Every framework folder must have the same examples.
const root = path.join(import.meta.dirname, "../../examples/components/trigger-menu")
const folders = ["react", "vue", "svelte", "web", "solid"]
const examplesIn = (folder: string) =>
  readdirSync(path.join(root, folder), { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name.replace(/\.\w+$/, ""))

// The examples in the order they appear on the Trigger Menu page, with the text that opens each one.
const triggers: Record<string, string> = {
  demo: "@",
  data: "@",
  commands: "/",
  icons: "/",
  async: "#",
  "custom-items": "@",
  input: "@",
  positioning: "@",
  controlled: "@",
  controller: "@",
  editor: "@",
}
const order = Object.keys(triggers)

for (const framework of frameworks) {
  test(`every trigger menu example opens in ${framework}`, async ({ page }) => {
    test.setTimeout(120_000)
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
    await page.goto(`/docs/${framework}/components/trigger-menu`)
    const previews = page.locator("[data-example]")
    await expect(previews).toHaveCount(order.length)
    for (const [index, name] of order.entries()) {
      const field = previews.nth(index).locator("textarea, input:not([type=checkbox])").first()
      await field.scrollIntoViewIfNeeded()
      await field.click()
      await page.keyboard.type(triggers[name])
      const list = page.getByRole("listbox").last()
      await expect(list, `${name} list`).toBeVisible()
      await page.keyboard.press("Escape")
      // A list animating out swallows presses, like the next example's field below it.
      await expect(page.locator("[data-ending-style]")).toHaveCount(0)
    }
    expect(errors).toEqual([])
    for (const folder of folders) expect(examplesIn(folder).sort(), folder).toEqual([...order].sort())
  })
}

// Typing filters the list, and choosing inserts the name.
for (const framework of frameworks) {
  test(`choosing a suggestion inserts it in ${framework}`, async ({ page }) => {
    test.setTimeout(120_000)
    await page.goto(`/docs/${framework}/components/trigger-menu`)
    const field = page.locator("[data-example]").first().locator("textarea").first()
    await field.click()
    await page.keyboard.type("hi @gra")
    await page.getByRole("option", { name: "Grace Hopper" }).click()
    await expect(field).toHaveValue("hi @Grace Hopper ")
  })
}
