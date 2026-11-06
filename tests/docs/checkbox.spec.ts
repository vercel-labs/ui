import { expect, type Locator } from "@playwright/test"
import { test } from "./docs-test"
import { readdirSync } from "node:fs"
import path from "node:path"

const frameworks = ["react", "vue", "web-components", "svelte", "solid"]
// Every framework folder must have the same examples.
const root = path.join(import.meta.dirname, "../../examples/components/checkbox")
const folders = ["react", "vue", "web", "svelte", "solid"]
const examplesIn = (folder: string) =>
  readdirSync(path.join(root, folder), { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name.replace(/\.\w+$/, ""))

// The order examples appear on the Checkbox page, groups included.
const order = [
  "basic",
  "description",
  "disabled",
  "read-only",
  "controlled",
  "form",
  "group",
  "group-parent",
  "group-disabled",
  "group-controlled",
  "group-field",
  "table",
  "indicator",
  "render",
]

// A checkbox to press in each single-checkbox example, and its aria-checked
// before and after. Disabled and read-only ones stay put.
const press: Record<string, { name: RegExp; from: string; to: string }> = {
  basic: { name: /^Accept terms and conditions$/, from: "false", to: "true" },
  description: { name: /^Accept terms and conditions$/, from: "false", to: "true" },
  disabled: { name: /^Security alerts$/, from: "true", to: "true" },
  table: { name: /^Select all$/, from: "mixed", to: "true" },
  controlled: { name: /^Email me about product updates$/, from: "false", to: "true" },
  "read-only": { name: /^Require two-factor authentication$/, from: "true", to: "true" },
  form: { name: /^Accept terms and conditions$/, from: "false", to: "true" },
  indicator: { name: /^Write the release notes$/, from: "false", to: "true" },
}

// An unchecked checkbox to check in each group example.
const next: Record<string, string> = {
  group: "Olives",
  "group-parent": "Select all",
  "group-disabled": "Downloads",
  "group-controlled": "Wednesday",
  "group-field": "SMS",
}

// The last line an example logged to its console.
function lastLog(preview: Locator) {
  return preview
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()
}

for (const framework of frameworks) {
  test(`every checkbox example works in ${framework}`, async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
    await page.goto(`/docs/${framework}/components/checkbox`)
    const previews = page.locator("[data-example]")
    await expect(previews).toHaveCount(order.length)
    for (const folder of folders)
      expect(examplesIn(folder).sort(), folder).toEqual([...order, "rtl", "group-rtl"].sort())

    for (const [name, { name: label, from, to }] of Object.entries(press)) {
      const checkbox = previews.nth(order.indexOf(name)).getByRole("checkbox", { name: label })
      await expect(checkbox, `${name} starts`).toHaveAttribute("aria-checked", from)
      await checkbox.click({ force: from === to })
      await expect(checkbox, `${name} after a press`).toHaveAttribute("aria-checked", to)
    }

    await expect(
      lastLog(previews.nth(order.indexOf("table"))),
      "selecting every row logs the count",
    ).toHaveText("4 of 4 selected")

    const controlled = previews.nth(order.indexOf("controlled"))
    await controlled.getByRole("button", { name: "Toggle" }).click()
    await expect(
      controlled.getByRole("checkbox", { name: /^Email me about product updates$/ }),
      "a controller toggles the checkbox from outside",
    ).toHaveAttribute("aria-checked", "false")
    await expect(lastLog(controlled), "the controller toggles with its own reason").toHaveText(
      "Unchecked (imperative)",
    )

    const form = previews.nth(order.indexOf("form"))
    await form.getByRole("button", { name: "Create Account" }).click()
    await expect(lastLog(form), "the form submits both checkboxes").toHaveText(
      "Submitted terms=yes&newsletter=weekly",
    )
    await form.getByRole("button", { name: "Reset" }).click()
    await expect(
      form.getByRole("checkbox", { name: /^Accept terms and conditions$/ }),
      "the form resets to the defaults",
    ).toHaveAttribute("aria-checked", "false")

    expect(errors).toEqual([])
  })
}

for (const framework of frameworks) {
  test(`every checkbox group example works in ${framework}`, async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
    await page.goto(`/docs/${framework}/components/checkbox`)
    const previews = page.locator("[data-example]")
    await expect(previews).toHaveCount(order.length)
    for (const folder of folders)
      expect(examplesIn(folder).sort(), folder).toEqual([...order, "rtl", "group-rtl"].sort())

    for (const name of Object.keys(next)) {
      const preview = previews.nth(order.indexOf(name))
      await expect(preview.getByRole("group").first(), `${name} group`).toBeVisible()
      const checkbox = preview.getByRole("checkbox", { name: next[name], exact: true })
      await expect(checkbox, `${name} starts unchecked`).not.toBeChecked()
      await checkbox.click()
      await expect(checkbox, `${name} checks`).toBeChecked()
    }

    const parent = previews.nth(order.indexOf("group-parent"))
    for (const topping of ["Cheese", "Mushrooms", "Olives", "Peppers"])
      await expect(
        parent.getByRole("checkbox", { name: topping, exact: true }),
        "the parent checked every topping",
      ).toBeChecked()

    const disabled = previews.nth(order.indexOf("group-disabled"))
    const photos = disabled.getByRole("checkbox", { name: "Photos", exact: true })
    await expect(photos).toBeDisabled()
    await photos.click({ force: true })
    await expect(photos, "a disabled group never changes").toBeChecked()
    const selectAll = disabled.getByRole("checkbox", { name: "Select all", exact: true })
    await selectAll.click()
    await selectAll.click()
    await expect(
      disabled.getByRole("checkbox", { name: "Desktop", exact: true }),
      "a disabled checkbox keeps its state when the parent toggles",
    ).toBeChecked()
    await expect(disabled.getByRole("checkbox", { name: "Downloads", exact: true })).not.toBeChecked()

    const controlled = previews.nth(order.indexOf("group-controlled"))
    await controlled.getByRole("button", { name: "Select Weekdays" }).click()
    await expect(
      controlled.getByRole("checkbox", { name: "Friday", exact: true }),
      "the controller checks values from outside the group",
    ).toBeChecked()
    await expect(controlled.getByRole("checkbox", { name: "Saturday", exact: true })).not.toBeChecked()
    await controlled.getByRole("button", { name: "Clear" }).click()
    await expect(controlled.getByRole("checkbox", { name: "Monday", exact: true })).not.toBeChecked()

    const field = previews.nth(order.indexOf("group-field"))
    await field.getByRole("checkbox", { name: "SMS", exact: true }).click()
    await field.getByRole("button", { name: "Save" }).click()
    await expect(
      field.getByText("Choose at least one way to be notified."),
      "saving with nothing checked shows the field's error",
    ).toBeVisible()

    expect(errors).toEqual([])
  })
}
