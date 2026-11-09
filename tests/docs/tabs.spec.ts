import { expect, type Locator } from "@playwright/test"
import { test } from "./docs-test"
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
  vertical: /^Security$/,
  disabled: /^Analytics$/,
  icons: /^Replies$/,
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
const order = Object.keys(next)
// Line and right-to-left examples stay in the folders but are off the page for now.
const fixtures = [...order, "line", "rtl"]

const lastLog = (preview: Locator) =>
  preview
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()

for (const framework of frameworks) {
  test(`every tabs example works in ${framework}`, async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on(
      "console",
      (message) => message.type() === "error" && errors.push(message.text())
    )
    await page.goto(`/docs/${framework}/components/tabs`)
    const previews = page.locator("[data-example]")
    await expect(previews).toHaveCount(order.length)
    for (const folder of folders) {
      expect(examplesIn(folder).sort(), folder).toEqual([...fixtures].sort())
    }

    const preview = (name: string) =>
      page.locator(`[data-example="tabs/${name}"]`)

    for (const name of order) {
      await expect(
        preview(name).getByRole("tablist"),
        `${name} tab list`
      ).toBeVisible()
      const tab = preview(name).getByRole("tab", { name: next[name] })
      await tab.click()
      await expect(tab, `${name} selects`).toHaveAttribute(
        "aria-selected",
        "true"
      )
      await expect(
        preview(name).getByRole("tabpanel", { name: next[name] }),
        `${name} panel`
      ).toBeVisible()
    }

    // A disabled tab never selects.
    const reports = preview("disabled").getByRole("tab", { name: "Reports" })
    await reports.click({ force: true })
    await expect(reports).toHaveAttribute("aria-selected", "false")

    // With manual activation, arrow keys move focus without selecting.
    const snippet = preview("manual")
    await snippet.getByRole("tab", { name: "Preview" }).click()
    await page.keyboard.press("ArrowRight")
    await expect(snippet.getByRole("tab", { name: "Code" })).toBeFocused()
    await expect(snippet.getByRole("tab", { name: "Code" })).toHaveAttribute(
      "aria-selected",
      "false"
    )
    await page.keyboard.press("Enter")
    await expect(snippet.getByRole("tab", { name: "Code" })).toHaveAttribute(
      "aria-selected",
      "true"
    )
    await page.keyboard.press("Tab")
    await expect(snippet.getByRole("textbox", { name: "Source" })).toBeFocused()

    // Without loop, Right Arrow stops at the last tab.
    const year = preview("loop").getByRole("tab", { name: "Year" })
    await year.click()
    await page.keyboard.press("ArrowRight")
    await expect(year).toBeFocused()
    await expect(year).toHaveAttribute("aria-selected", "true")

    // The indicator follows the selection into a vertical list.
    await preview("indicator").getByRole("button", { name: "Vertical" }).click()
    await expect(preview("indicator").getByRole("tablist")).toHaveAttribute(
      "aria-orientation",
      "vertical"
    )

    // A kept-mounted panel keeps what was typed in it.
    const kept = preview("keep-mounted")
    await kept.getByRole("tab", { name: "Reply" }).click()
    await kept.getByRole("textbox", { name: "Message" }).fill("Looks good")
    await kept.getByRole("tab", { name: "Formatting" }).click()
    await kept.getByRole("tab", { name: "Reply" }).click()
    await expect(kept.getByRole("textbox", { name: "Message" })).toHaveValue(
      "Looks good"
    )

    // The controller selects a tab, and the console logs each change with its reason.
    const mail = preview("controlled")
    await expect(lastLog(mail)).toHaveText("value: drafts (item-press)")
    await mail.getByRole("button", { name: "Show Sent Mail" }).click()
    await expect(mail.getByRole("tab", { name: "Sent" })).toHaveAttribute(
      "aria-selected",
      "true"
    )
    await expect(lastLog(mail)).toHaveText("value: sent (imperative)")

    // A link tab selects and follows its hash.
    await expect(page).toHaveURL(/#project-activity$/)

    expect(errors).toEqual([])
  })
}
