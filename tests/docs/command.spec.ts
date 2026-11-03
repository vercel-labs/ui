import { expect, test } from "@playwright/test"
import { readdirSync } from "node:fs"
import path from "node:path"

const frameworks = ["react", "vue", "svelte", "web-components", "solid"]
// Every framework folder must have the same examples.
const root = path.join(import.meta.dirname, "../../examples/components/command")
const folders = ["react", "vue", "svelte", "web", "solid"]
const examplesIn = (folder: string) =>
  readdirSync(path.join(root, folder), { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name.replace(/\.\w+$/, ""))

// The examples in the order they appear on the Command page.
const fixtureNames = [
  "demo",
  "dialog",
  "shortcuts",
  "groups",
  "scrollable",
  "rtl",
  "highlight",
  "suggestions",
  "pages",
  "data",
  "async",
  "pending",
  "filter",
  "keywords",
  "auto-highlight",
  "controlled",
  "controller",
  "virtualized",
  "custom-rendering",
]

const order = [
  "demo",
  "dialog",
  "shortcuts",
  "groups",
  "scrollable",
  "highlight",
  "suggestions",
  "pages",
  "data",
  "async",
  "pending",
  "filter",
  "keywords",
  "auto-highlight",
  "virtualized",
  "custom-rendering",
]

for (const framework of frameworks) {
  test(`every command example works in ${framework}`, async ({ page }) => {
    test.setTimeout(120_000)
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
    await page.goto(`/docs/${framework}/components/command`)
    // Opening a modal before hydration makes not-yet-hydrated markup inert.
    await page.waitForLoadState("networkidle")
    const previews = page.locator("[data-example]")
    await expect(previews).toHaveCount(order.length)

    for (const name of order) {
      const preview = page.locator(`[data-example="command/${name}"]`)
      await preview.scrollIntoViewIfNeeded()
      if (name === "dialog") {
        await preview.getByRole("button", { name: /Search/ }).click()
        const dialog = page.getByRole("dialog", { name: "Command palette" })
        await expect(dialog, name).toBeVisible()
        await expect(dialog.getByRole("option").first(), name).toBeVisible()
        await page.keyboard.press("Escape")
        await expect(dialog, `${name} closes`).toBeHidden()
        continue
      }
      await expect(preview.getByRole("option").first(), `${name} commands`).toBeVisible()
      const input = preview.getByRole("combobox").first()
      await input.focus()
      await page.keyboard.press("ArrowDown")
      await expect(input, `${name} highlights`).toHaveAttribute("aria-activedescendant", /.+/)
    }

    expect(errors).toEqual([])
    for (const folder of folders) expect(examplesIn(folder).sort(), folder).toEqual([...fixtureNames].sort())
  })
}

// Typing ranks the commands, and Enter runs the best match.
for (const framework of frameworks) {
  test(`typing filters and highlights the best match in ${framework}`, async ({ page }) => {
    await page.goto(`/docs/${framework}/components/command`)
    const preview = page.locator("[data-example]").first()
    const input = preview.getByRole("combobox")
    await input.pressSequentially("bil")
    await expect(preview.getByRole("option")).toHaveCount(1)
    await expect(preview.getByRole("option", { name: /Billing/ })).toHaveAttribute("data-highlighted", "")
  })
}

// The data example renders its own styled items from the data: their shortcuts
// run once from the field, and a command with items opens its page.
for (const framework of frameworks) {
  test(`styled data commands keep their shortcuts and pages in ${framework}`, async ({ page }) => {
    const warnings: string[] = []
    page.on("console", (message) => message.type() === "warning" && warnings.push(message.text()))
    await page.goto(`/docs/${framework}/components/command`)
    await page.waitForLoadState("networkidle")
    const preview = page.locator('[data-example="command/data"]')
    await preview.scrollIntoViewIfNeeded()
    const inbox = preview.getByRole("option", { name: /Open inbox/ })
    await expect(inbox).toHaveAttribute("aria-keyshortcuts", /I/)
    await preview.getByRole("combobox").focus()
    await page.keyboard.press("ControlOrMeta+i")
    await expect(preview.locator("output")).toHaveText("Ran inbox")
    await preview.getByRole("option", { name: /Change theme/ }).click()
    await expect(preview.getByRole("option", { name: "Light" })).toBeVisible()
    expect(warnings.filter((text) => text.includes("registered twice"))).toEqual([])
  })
}
