import { expect, type Page } from "@playwright/test"
import { test } from "./docs-test"
import { readdirSync } from "node:fs"
import path from "node:path"

// Every framework folder must have the same examples.
const root = path.join(import.meta.dirname, "../../examples/components/menu")
const frameworks = ["react", "vue", "web-components", "svelte", "solid"]
const folders = ["react", "vue", "web", "svelte", "solid"]
const examplesIn = (folder: string) =>
  readdirSync(path.join(root, folder)).map((file) => file.replace(/\.\w+$/, ""))
const examples = examplesIn("react")

// The examples in the order they appear on the Menu page, each with the name
// of the trigger to open. The page opens with the basic example. The context
// menu opens from an area, with a right-click.
const triggers: Record<string, string | RegExp> = {
  basic: "Open Menu",
  submenu: "Edit",
  shortcuts: "File",
  icons: "Share",
  checkboxes: "View",
  "radio-group": "Panel",
  "context-menu": /long-press here$/i,
  disabled: "Document",
  animation: "Animated",
  presentation: "Options",
  payload: "Actions for Budget.xlsx",
}
const order = Object.keys(triggers)
// Right-to-left stays in every folder, off the page for now.
const fixtures = [...order, "rtl"]

async function errorsOn(page: Page) {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text())
    }
  })
  return errors
}

for (const framework of frameworks) {
  test(`every menu example works in ${framework}`, async ({ page }) => {
    const errors = await errorsOn(page)
    await page.goto(`/docs/${framework}/components/menu`)
    const previews = page.locator("[data-example]")
    await expect(previews).toHaveCount(order.length)
    expect(examples.sort()).toEqual([...fixtures].sort())
    for (const folder of folders) {
      expect(examplesIn(folder).sort(), folder).toEqual([...fixtures].sort())
    }

    for (const [index, name] of order.entries()) {
      const preview = previews.nth(index)
      if (name === "context-menu") {
        const area = preview.getByText(triggers[name])
        await expect(area, `${name} area`).toBeVisible()
        await area.scrollIntoViewIfNeeded()
        await area.click({ button: "right" })
      } else {
        const trigger = preview.getByRole("button", {
          name: triggers[name],
          exact: true,
        })
        await expect(trigger, `${name} trigger`).toBeVisible()
        await trigger.click()
      }
      const menu = page.getByRole("menu").first()
      await expect(menu, `${name} menu`).toBeVisible()
      await expect(menu.locator('[role^="menuitem"]').first()).toBeVisible()
      await page.keyboard.press("Escape")
      await expect(page.getByRole("menu")).toHaveCount(0)
    }

    expect(errors).toEqual([])
  })
}
