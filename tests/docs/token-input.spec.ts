import { expect, test } from "@playwright/test"
import { readdirSync } from "node:fs"
import path from "node:path"

const frameworks = ["react", "vue", "svelte", "web-components", "solid"]
const root = path.join(import.meta.dirname, "../../examples/components/token-input")
const folders = ["react", "vue", "svelte", "web", "solid"]
const examplesIn = (folder: string) =>
  readdirSync(path.join(root, folder), { withFileTypes: true })
    .filter((file) => file.isFile())
    .map((file) => file.name.replace(/\.\w+$/, ""))

// The examples in the order they appear on the page, and whether a menu opens on @.
const menus: Record<string, boolean> = {
  "prompt-input": true,
  deletion: true,
  codec: false,
  form: false,
  controlled: true,
  controller: false,
  "submit-shortcut": false,
}
const order = ["demo", ...Object.keys(menus)]

for (const framework of frameworks) {
  test(`every token input example takes text and tokens in ${framework}`, async ({ page }) => {
    test.setTimeout(120_000)
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
    await page.goto(`/docs/${framework}/components/token-input`)
    const previews = page.locator("[data-example]")
    await expect(previews).toHaveCount(order.length)
    for (const [index, name] of order.entries()) {
      const editor = previews.nth(index).locator('[data-slot="token-input-editor"]')
      await editor.scrollIntoViewIfNeeded()
      await editor.click()
      await page.keyboard.press("ControlOrMeta+End")
      await page.keyboard.type(" @")
      if (name === "demo" || menus[name]) {
        await expect(page.getByRole("listbox").last(), `${name} list`).toBeVisible()
        await page.keyboard.press("Enter")
        await expect(editor.locator("[data-token-id]").last(), `${name} token`).toBeVisible()
      }
    }
    expect(errors).toEqual([])
    for (const folder of folders) expect(examplesIn(folder).sort(), folder).toEqual([...order].sort())
  })
}

// The Form example's input sits outside its form and joins it with `form`.
for (const framework of frameworks) {
  test(`Enter submits the form a token input joins from outside it in ${framework}`, async ({ page }) => {
    await page.goto(`/docs/${framework}/components/token-input`)
    await page.waitForLoadState("networkidle")
    const preview = page.locator("[data-example]").nth(order.indexOf("form"))
    await expect(preview.locator("form [data-slot='token-input-editor']")).toHaveCount(0)
    const editor = preview.locator('[data-slot="token-input-editor"]')
    await editor.click()
    await page.keyboard.press("Enter")
    await expect(preview.locator("form p")).toContainText("[@routes.ts](file:src/routes.ts)")
  })
}
