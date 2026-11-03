import { expect, test, type Page } from "@playwright/test"
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
  basic: "Project",
  submenu: "Edit",
  shortcuts: "File",
  icons: "Share",
  checkboxes: "View",
  "checkbox-icons": "Notifications",
  "radio-group": "Panel",
  "radio-icons": "Payment method",
  destructive: "Actions",
  avatar: "Account",
  complex: "Workspace",
  "context-menu": /long-press here$/i,
  rtl: "ملف",
  placement: "Placement",
  offsets: "Inter",
  modal: "Default",
  "hover-delay": "Default",
  keyboard: "Online",
  disabled: "Document",
  "close-on-select": "Zoom 100%",
  container: "Open",
  animation: "Animated",
  presentation: "Options",
  controlled: "Actions",
  payload: "Actions for Budget.xlsx",
  data: "File",
  links: "Links",
}
const order = Object.keys(triggers)

async function errorsOn(page: Page) {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text())
  })
  return errors
}

for (const framework of frameworks) {
  test(`every menu example works in ${framework}`, async ({ page }) => {
    const errors = await errorsOn(page)
    await page.goto(`/docs/${framework}/components/menu`)
    const previews = page.locator("[data-example]")
    await expect(previews).toHaveCount(order.length)
    expect(examples.sort()).toEqual([...order].sort())
    for (const folder of folders) expect(examplesIn(folder).sort(), folder).toEqual([...order].sort())

    for (const [index, name] of order.entries()) {
      const preview = previews.nth(index)
      if (name === "context-menu") {
        const area = preview.getByText(triggers[name])
        await expect(area, `${name} area`).toBeVisible()
        await area.scrollIntoViewIfNeeded()
        await area.click({ button: "right" })
      } else {
        const trigger = preview.getByRole("button", { name: triggers[name], exact: true })
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
