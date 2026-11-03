import { expect, test } from "@playwright/test"
import { readdirSync } from "node:fs"
import path from "node:path"

const frameworks = ["react", "vue", "svelte", "solid", "web-components"]
// Every framework folder must have the same examples.
const root = path.join(import.meta.dirname, "../../examples/components/tabs")
const folders = ["react", "vue", "svelte", "solid", "web"]
const examplesIn = (folder: string) =>
  readdirSync(path.join(root, folder), { withFileTypes: true })
    .filter((file) => file.isFile())
    .map((file) => file.name.replace(/\.\w+$/, ""))

// The order examples appear on the Tabs page, and a tab to select in each.
const next: Record<string, RegExp> = {
  basic: /^Password$/,
  line: /^Analytics$/,
  vertical: /^Security$/,
  disabled: /^Analytics$/,
  icons: /^Replies$/,
  rtl: /^كلمة المرور$/,
  manual: /^Code$/,
  loop: /^Week$/,
  indicator: /^Podcasts$/,
  "keep-mounted": /^Formatting$/,
  "find-in-page": /^Returns$/,
  animation: /^Activity$/,
  controlled: /^Drafts$/,
  links: /^Activity$/,
  render: /^Unread/,
}
const fixtureNames = Object.keys(next)
const order = [
  "basic",
  "vertical",
  "disabled",
  "icons",
  "manual",
  "loop",
  "indicator",
  "keep-mounted",
  "find-in-page",
  "animation",
  "controlled",
  "links",
]

for (const framework of frameworks) {
  test(`every tabs example works in ${framework}`, async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
    await page.goto(`/docs/${framework}/components/tabs`)
    const previews = page.locator("[data-example]")
    await expect(previews).toHaveCount(order.length)
    for (const folder of folders) expect(examplesIn(folder).sort(), folder).toEqual([...fixtureNames].sort())

    for (const name of order) {
      const preview = page.locator(`[data-example="tabs/${name}"]`)
      await expect(preview.getByRole("tablist"), `${name} tab list`).toBeVisible()
      const tab = preview.getByRole("tab", { name: next[name] })
      await tab.click()
      await expect(tab, `${name} selects`).toHaveAttribute("aria-selected", "true")
      await expect(preview.getByRole("tabpanel", { name: next[name] }), `${name} panel`).toBeVisible()
    }

    // A disabled tab never selects.
    const disabled = page.locator(`[data-example="tabs/disabled"]`).getByRole("tab", { name: "Reports" })
    await disabled.click({ force: true })
    await expect(disabled).toHaveAttribute("aria-selected", "false")

    // A kept-mounted panel keeps what was typed in it.
    const kept = page.locator(`[data-example="tabs/keep-mounted"]`)
    await kept.getByRole("tab", { name: "Reply" }).click()
    await kept.getByRole("textbox", { name: "Reply" }).fill("Looks good")
    await kept.getByRole("tab", { name: "Formatting" }).click()
    await kept.getByRole("tab", { name: "Reply" }).click()
    await expect(kept.getByRole("textbox", { name: "Reply" })).toHaveValue("Looks good")

    expect(errors).toEqual([])
  })
}
