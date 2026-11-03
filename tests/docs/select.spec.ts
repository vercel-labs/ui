import { expect, test } from "@playwright/test"
import { readdirSync } from "node:fs"
import path from "node:path"

const frameworks = ["react", "vue", "web-components", "svelte", "solid"]
// Every framework folder must have the same examples.
const root = path.join(import.meta.dirname, "../../examples/components/select")
const folders = ["react", "vue", "web", "svelte", "solid"]
const examplesIn = (folder: string) =>
  readdirSync(path.join(root, folder), { withFileTypes: true })
    .filter((file) => file.isFile())
    .map((file) => file.name.replace(/\.\w+$/, ""))

// The examples in the order they appear on the Select page.
const order = [
  "demo",
  "align-item",
  "groups",
  "scrollable",
  "icons",
  "disabled",
  "invalid",
  "rtl",
  "multiple",
  "select-all",
  "placeholder",
  "clearable",
  "typeahead",
  "searchable",
  "search-groups",
  "async-search",
  "data",
  "options",
  "object-values",
  "custom-rendering",
  "virtualized",
  "form",
  "controlled",
  "controller",
  "positioning",
  "modal",
  "loop",
  "container",
  "animation",
  "presentation",
]

const renderedExamples = [
  "demo",
  "data",
  "groups",
  "icons",
  "typeahead",
  "disabled",
  "clearable",
  "multiple",
  "select-all",
  "search-groups",
  "async-search",
  "object-values",
  "virtualized",
  "align-item",
  "scrollable",
  "invalid",
  "form",
  "presentation",
]

for (const framework of frameworks) {
  test(`every select example works in ${framework}`, async ({ page }) => {
    test.setTimeout(120_000)
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
    await page.goto(`/docs/${framework}/components/select`)
    const previews = page.locator("[data-example]")
    const rendered = renderedExamples
    await expect(previews).toHaveCount(rendered.length)

    for (const name of rendered) {
      // The first trigger that can open.
      const trigger = page
        .locator(`[data-example="select/${name}"]`)
        .locator('[role="combobox"]:not([disabled]):not([aria-disabled="true"]):not([aria-readonly="true"])')
        .first()
      await trigger.scrollIntoViewIfNeeded()
      await trigger.click()
      const list = page.getByRole("listbox").first()
      await expect(list, `${name} list`).toBeVisible()
      await expect(list.getByRole("option").first(), `${name} items`).toBeVisible()
      await page.keyboard.press("Escape")
      await expect(page.getByRole("listbox"), `${name} closes`).toHaveCount(0)
    }

    expect(errors).toEqual([])
    for (const folder of folders) expect(examplesIn(folder).sort(), folder).toEqual([...order].sort())
  })
}

// Choosing an item shows its label in the trigger.
for (const framework of frameworks) {
  test(`choosing an item shows its label in ${framework}`, async ({ page }) => {
    test.setTimeout(120_000)
    await page.goto(`/docs/${framework}/components/select`)
    const preview = page.locator('[data-example="select/demo"]')
    const trigger = preview.getByRole("combobox")
    await trigger.click()
    await page.getByRole("listbox").getByRole("option", { name: "Blueberry" }).click()
    await expect(trigger).toContainText("Blueberry")
  })
}

// Each group is named by its label.
for (const framework of frameworks) {
  test(`groups are named by their labels in ${framework}`, async ({ page }) => {
    await page.goto(`/docs/${framework}/components/select`)
    await page.waitForLoadState("networkidle")
    const preview = page.locator('[data-example="select/groups"]')
    await preview.getByRole("combobox").click()
    await expect(page.getByRole("listbox").getByRole("group", { name: "Fruits" })).toBeVisible()
  })
}
