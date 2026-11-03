import { expect, test } from "@playwright/test"
import { readdirSync } from "node:fs"
import path from "node:path"
import { onPage } from "./docs-helpers"

const frameworks = ["react", "vue", "svelte", "solid", "web-components"]
// Every framework folder must have the same examples.
const root = path.join(import.meta.dirname, "../../examples/components/resizable")
const folders = ["react", "vue", "svelte", "solid", "web"]
const examplesIn = (folder: string) =>
  readdirSync(path.join(root, folder), { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name.replace(/\.\w+$/, ""))

// The order examples appear on the Resizable page, a handle in each, the key
// that grows the panel before it, and by how much.
const handles: Record<string, { name: string; key: string; by: number }> = {
  basic: { name: "Resize one", key: "ArrowRight", by: 1 },
  vertical: { name: "Resize header", key: "ArrowDown", by: 1 },
  handle: { name: "Resize sidebar", key: "ArrowRight", by: 1 },
  rtl: { name: "تغيير حجم واحد", key: "ArrowLeft", by: 1 },
  collapsible: { name: "Resize sidebar", key: "ArrowRight", by: 1 },
  sizes: { name: "Resize navigation", key: "ArrowRight", by: 1 },
  "default-layout": { name: "Resize files", key: "ArrowRight", by: 1 },
  controlled: { name: "Resize files", key: "ArrowRight", by: 1 },
  complete: { name: "Resize files", key: "ArrowRight", by: 1 },
  persistence: { name: "Resize sidebar", key: "ArrowRight", by: 1 },
  storage: { name: "Resize files", key: "ArrowRight", by: 1 },
  controller: { name: "Resize sidebar", key: "ArrowRight", by: 1 },
  keyboard: { name: "Resize left", key: "ArrowRight", by: 5 },
  disabled: { name: "Resize two", key: "ArrowRight", by: 1 },
  render: { name: "Resize files", key: "ArrowRight", by: 1 },
}
const fixtures = Object.keys(handles)
const order = fixtures.filter(onPage)

for (const framework of frameworks) {
  test(`every resizable example works in ${framework}`, async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
    await page.goto(`/docs/${framework}/components/resizable`)
    const previews = page.locator("[data-example]")
    await expect(previews).toHaveCount(order.length)
    for (const folder of folders) expect(examplesIn(folder).sort(), folder).toEqual([...fixtures].sort())

    for (const [index, name] of order.entries()) {
      const { name: label, key, by } = handles[name]
      const handle = previews.nth(index).getByRole("separator", { name: label, exact: true })
      await expect(handle, `${name} lays its panels out`).toHaveAttribute("aria-valuenow", /^\d+$/)
      const from = Number(await handle.getAttribute("aria-valuenow"))
      await handle.focus()
      await page.keyboard.press(key)
      await expect(handle, `${name} after ${key}`).toHaveAttribute("aria-valuenow", String(from + by))
    }

    // The controller collapses the sidebar from outside.
    const controller = previews.nth(order.indexOf("controller"))
    await controller.getByRole("button", { name: "Collapse" }).click()
    await expect(controller.getByRole("separator")).toHaveAttribute("aria-valuenow", "0")

    // Completing saves once, after the key comes up.
    const complete = previews.nth(order.indexOf("complete"))
    await expect(complete.getByText("1 changes, saved 41 / 59 after step-key")).toBeVisible()
    // A disabled handle is out of the tab order.
    const disabled = previews.nth(order.indexOf("disabled"))
    await expect(disabled.getByRole("separator", { name: "Resize fixed" })).not.toHaveAttribute("tabindex")

    expect(errors).toEqual([])
  })
}
