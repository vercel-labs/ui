import { expect, test } from "@playwright/test"
import { readdirSync } from "node:fs"
import path from "node:path"

const frameworks = ["react", "vue", "svelte", "solid", "web-components"]
// Every framework folder must have the same examples.
const root = path.join(import.meta.dirname, "../../examples/components/number-input")
const folders = ["react", "vue", "svelte", "solid", "web"]
const examplesIn = (folder: string) =>
  readdirSync(path.join(root, folder), { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name.replace(/\.\w+$/, ""))

// The order examples appear on the Number Input page, the input in each, the
// button that steps it, and the text before and after a press.
const fields: Record<string, { name: RegExp; button?: string; from: string | RegExp; to: string | RegExp }> =
  {
    basic: { name: /^Quantity$/, button: "Increase", from: "1", to: "2" },
    field: { name: /^Quantity$/, button: "Increase", from: "1", to: "2" },
    "min-max": { name: /^Guests$/, button: "Increase", from: "2", to: "3" },
    step: { name: /^Hours$/, button: "Increase", from: "1.5", to: "1.75" },
    format: { name: /^Price$/, button: "Increase", from: "$19.99", to: "$20.00" },
    locale: { name: /^Preis$/, button: "Increase", from: /^1\.234,50\s€$/, to: /^1\.234,51\s€$/ },
    wheel: { name: /^Font size$/, button: "Increase", from: "16", to: "17" },
    scrub: { name: /^Width$/, from: "320", to: "320" },
    toolbar: { name: /^Letter spacing$/, from: "0", to: "0" },
    disabled: { name: /^Quantity$/, button: "Increase", from: "3", to: "3" },
    "read-only": { name: /^Seats included$/, button: "Increase", from: "5", to: "5" },
    invalid: { name: /^Age$/, from: "", to: "" },
    controlled: { name: /^Servings$/, button: "Increase", from: "4", to: "5" },
    controller: { name: /^Zoom$/, button: "Zoom in", from: "100", to: "110" },
    form: { name: /^Quantity$/, button: "Increase", from: "2", to: "3" },
  }
const order = Object.keys(fields)
const fixtures = [...order, "buttons", "rtl", "render"]

// Examples whose buttons never step.
const locked = new Set(["disabled", "read-only"])

for (const framework of frameworks) {
  test(`every number input example works in ${framework}`, async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
    await page.goto(`/docs/${framework}/components/number-input`)
    const previews = page.locator("[data-example]")
    await expect(previews).toHaveCount(order.length)
    for (const folder of folders) expect(examplesIn(folder).sort(), folder).toEqual([...fixtures].sort())

    for (const name of order) {
      const { name: label, button, from, to } = fields[name]
      const preview = page.locator(`[data-example="number-input/${name}"]`)
      const input = preview.getByRole("textbox", { name: label })
      await expect(input, `${name} starts`).toHaveValue(from)
      if (!button) continue
      // The first field's button, in examples with several.
      await preview
        .getByRole("button", { name: button, exact: true })
        .first()
        .click({ force: locked.has(name) })
      await expect(input, `${name} after a press`).toHaveValue(to)
    }

    // Submitting while empty shows the error.
    const invalid = page.locator('[data-example="number-input/invalid"]')
    await invalid.getByRole("button", { name: "Continue" }).click()
    await expect(invalid.getByText("Enter your age.")).toBeVisible()

    // The controller steps the field from outside.
    const controller = page.locator('[data-example="number-input/controller"]')
    await controller.getByRole("button", { name: "Actual size" }).click()
    await expect(controller.getByRole("textbox", { name: /^Zoom$/ })).toHaveValue("100")

    // Saving submits the plain numbers, with the field outside the form, and Reset restores them.
    const form = page.locator('[data-example="number-input/form"]')
    await form.getByRole("button", { name: "Save" }).click()
    await expect(form.getByText("Submitted: quantity=3, tip=1234.5, gift-cards=0")).toBeVisible()
    await form.getByRole("button", { name: "Reset" }).click()
    await expect(form.getByRole("textbox", { name: /^Quantity$/ })).toHaveValue("2")

    expect(errors).toEqual([])
  })
}

// Arrow keys step the field.
for (const framework of frameworks) {
  test(`arrow keys step a number input in ${framework}`, async ({ page }) => {
    await page.goto(`/docs/${framework}/components/number-input`)
    await page.waitForLoadState("networkidle")
    const input = page
      .locator('[data-example="number-input/min-max"]')
      .getByRole("textbox", { name: /^Guests$/ })
    await input.focus()
    await page.keyboard.press("ArrowUp")
    await expect(input).toHaveValue("3")
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("ArrowDown")
    await expect(input).toHaveValue("1")
  })
}
