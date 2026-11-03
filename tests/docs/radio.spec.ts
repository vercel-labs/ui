import { expect, test } from "@playwright/test"
import { readdirSync } from "node:fs"
import path from "node:path"

const frameworks = ["react", "vue", "web-components", "svelte", "solid"]
// Every framework folder must have the same examples.
const root = path.join(import.meta.dirname, "../../examples/components/radio")
const folders = ["react", "vue", "web", "svelte", "solid"]
const examplesIn = (folder: string) =>
  readdirSync(path.join(root, folder), { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name.replace(/\.\w+$/, ""))

// The order examples appear on the Radio page, and a radio to check in each.
const next: Record<string, RegExp> = {
  basic: /^Compact$/,
  description: /^Compact$/,
  "choice-card": /^Pro/,
  legend: /^Yearly/,
  disabled: /^Nothing$/,
  invalid: /^SMS only$/,
  rtl: /^مضغوط$/,
  controlled: /^Starter$/,
  "read-only": /^Team$/,
  form: /^Express/,
  loop: /^High$/,
  indicator: /^Light$/,
  render: /^Nothing$/,
}
const order = Object.keys(next)

// Examples whose radio never checks: a read-only group keeps its choice.
const unchanged = new Set(["read-only"])

for (const framework of frameworks) {
  test(`every radio example works in ${framework}`, async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
    await page.goto(`/docs/${framework}/components/radio`)
    const previews = page.locator("[data-example]")
    await expect(previews).toHaveCount(order.length)
    for (const folder of folders)
      expect(examplesIn(folder).sort(), folder).toEqual([...order, "horizontal"].sort())

    // Saving without a choice shows the error.
    const invalid = previews.nth(order.indexOf("invalid"))
    const error = invalid.getByText("Choose how to receive notifications.")
    await expect(error).toBeHidden()
    await invalid.getByRole("button", { name: "Save" }).click()
    await expect(error).toBeVisible()

    for (const [index, name] of order.entries()) {
      const preview = previews.nth(index)
      await expect(preview.getByRole("radiogroup").first(), `${name} group`).toBeVisible()
      const radio = preview.getByRole("radio", { name: next[name] })
      await radio.click()
      if (unchanged.has(name)) await expect(radio, `${name} keeps its choice`).not.toBeChecked()
      else await expect(radio, `${name} checks`).toBeChecked()
    }

    // A read-only group keeps the radio it started with.
    await expect(previews.nth(order.indexOf("read-only")).getByRole("radio", { name: "Pro" })).toBeChecked()

    // A disabled group never changes.
    const disabled = previews.nth(order.indexOf("disabled")).getByRole("radio", { name: "Dark" })
    await disabled.click({ force: true })
    await expect(disabled).not.toBeChecked()

    // A controller checks a radio from outside the group.
    const controlled = previews.nth(order.indexOf("controlled"))
    await controlled.getByRole("button", { name: "Choose Team" }).click()
    await expect(controlled.getByRole("radio", { name: "Team" })).toBeChecked()

    // Reset returns the group to its default value.
    const form = previews.nth(order.indexOf("form"))
    await form.getByRole("button", { name: "Submit" }).click()
    await expect(form.getByText(/"shipping":"express"/)).toBeVisible()
    await form.getByRole("button", { name: "Reset" }).click()
    await expect(form.getByRole("radio", { name: /^Standard/ })).toBeChecked()

    expect(errors).toEqual([])
  })
}

// Arrow keys move and check, and `loop={false}` stops them at the ends.
for (const framework of frameworks) {
  test(`arrow keys check the next radio and stop at the ends in ${framework}`, async ({ page }) => {
    await page.goto(`/docs/${framework}/components/radio`)
    await page.waitForLoadState("networkidle")
    const loop = page.locator("[data-example]").nth(order.indexOf("loop"))
    const low = loop.getByRole("radio", { name: /^Low$/ })
    const high = loop.getByRole("radio", { name: /^High$/ })
    await low.focus()
    await page.keyboard.press("ArrowUp")
    await expect(low, "the first radio keeps the choice").toBeChecked()
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("ArrowDown")
    await expect(high).toBeChecked()
    await expect(high).toBeFocused()
    await page.keyboard.press("ArrowDown")
    await expect(high, "the last radio keeps the choice").toBeChecked()
    // Only the checked radio takes Tab.
    await expect(low).toHaveAttribute("tabindex", "-1")
    await expect(high).toHaveAttribute("tabindex", "0")
  })
}

// Space checks the focused radio and right to left mirrors the arrows.
for (const framework of frameworks) {
  test(`Space checks the focused radio and arrows follow right to left in ${framework}`, async ({ page }) => {
    await page.goto(`/docs/${framework}/components/radio`)
    await page.waitForLoadState("networkidle")
    const rtl = page.locator("[data-example]").nth(order.indexOf("rtl"))
    const [first, second, third] = [/^افتراضي$/, /^مريح$/, /^مضغوط$/].map((name) =>
      rtl.getByRole("radio", { name }),
    )
    await expect(second).toBeChecked()
    await second.focus()
    await page.keyboard.press("ArrowLeft")
    await expect(third, "the left arrow moves to the next radio").toBeChecked()
    await page.keyboard.press("ArrowRight")
    await expect(second, "the right arrow moves to the previous one").toBeChecked()
    await first.focus()
    await page.keyboard.press(" ")
    await expect(first).toBeChecked()
  })
}
