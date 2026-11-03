import { expect, test } from "@playwright/test"
import { readdirSync } from "node:fs"
import path from "node:path"

const frameworks = ["react", "vue", "svelte", "web-components", "solid"]
// Every framework folder must have the same examples.
const root = path.join(import.meta.dirname, "../../examples/components/combobox")
const folders = ["react", "vue", "svelte", "web", "solid"]
const examplesIn = (folder: string) =>
  readdirSync(path.join(root, folder), { withFileTypes: true })
    .filter((file) => file.isFile())
    .map((file) => file.name.replace(/\.\w+$/, ""))

// Every example on disk: the page's, plus rtl.
const fixtureNames = [
  "demo",
  "disabled",
  "clear",
  "auto-highlight",
  "highlight",
  "filter",
  "groups",
  "icons",
  "custom-items",
  "recent",
  "multiple",
  "select-all",
  "chips-overflow",
  "max-selected",
  "create",
  "custom-value",
  "popup",
  "async",
  "infinite",
  "virtualized",
  "controlled",
  "controller",
  "positioning",
  "animation",
  "presentation",
  "form",
  "custom-rendering",
  "rtl",
]

// The examples in the order they appear on the Combobox page.
const order = [
  "demo",
  "disabled",
  "clear",
  "auto-highlight",
  "highlight",
  "filter",
  "groups",
  "icons",
  "custom-items",
  "recent",
  "multiple",
  "select-all",
  "chips-overflow",
  "max-selected",
  "create",
  "custom-value",
  "popup",
  "async",
  "infinite",
  "virtualized",
  "controlled",
  "controller",
  "positioning",
  "animation",
  "presentation",
  "form",
  "custom-rendering",
]

for (const framework of frameworks) {
  test(`every combobox example works in ${framework}`, async ({ page }) => {
    test.setTimeout(120_000)
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
    await page.goto(`/docs/${framework}/components/combobox`)
    const previews = page.locator("[data-example]")
    await expect(previews).toHaveCount(order.length)

    for (const name of order) {
      const preview = page.locator(`[data-example="combobox/${name}"]`)
      // The first input that can open, or the button that opens the popup with the input inside.
      const trigger =
        name === "popup"
          ? preview.getByRole("button", { name: "Country" })
          : preview
              .locator(
                '[role="combobox"]:not([disabled]):not([aria-disabled="true"]):not([readonly]):not([aria-readonly="true"])',
              )
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
    for (const folder of folders) expect(examplesIn(folder).sort(), folder).toEqual([...fixtureNames].sort())
  })
}

// Typing filters the list, and choosing an item shows its label.
for (const framework of frameworks) {
  test(`typing filters and choosing shows the label in ${framework}`, async ({ page }) => {
    test.setTimeout(120_000)
    await page.goto(`/docs/${framework}/components/combobox`)
    const preview = page.locator("[data-example]").first()
    const trigger = preview.getByRole("combobox")
    await trigger.click()
    await trigger.pressSequentially("sv")
    const list = page.getByRole("listbox")
    await expect(list.getByRole("option")).toHaveCount(1)
    await list.getByRole("option", { name: "SvelteKit" }).click()
    await expect(trigger).toHaveValue("SvelteKit")
  })
}

// A group whose items are all filtered out goes with them, label and all,
// and the group left is named by its label.
for (const framework of frameworks) {
  test(`filtering hides empty groups and keeps the rest named in ${framework}`, async ({ page }) => {
    await page.goto(`/docs/${framework}/components/combobox`)
    await page.waitForLoadState("networkidle")
    const trigger = page.locator(`[data-example="combobox/groups"]`).getByRole("combobox")
    await trigger.click()
    await trigger.pressSequentially("chic")
    const list = page.getByRole("listbox")
    await expect(list.getByRole("group", { name: "Americas" })).toBeVisible()
    await expect(list.getByText("Europe", { exact: true })).toBeHidden()
  })
}
