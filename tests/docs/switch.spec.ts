import { expect, test } from "@playwright/test"
import { readdirSync } from "node:fs"
import path from "node:path"

const frameworks = ["react", "vue", "web-components", "svelte", "solid"]
// Every framework folder must have the same examples.
const root = path.join(import.meta.dirname, "../../examples/components/switch")
const folders = ["react", "vue", "web", "svelte", "solid"]
const examplesIn = (folder: string) =>
  readdirSync(path.join(root, folder), { withFileTypes: true })
    .filter((file) => file.isFile())
    .map((file) => file.name.replace(/\.\w+$/, ""))

// The order examples appear on the Switch page, the switch to press in each,
// and whether it's on before and after the press.
const press: Record<string, { name: RegExp; from: boolean; to: boolean }> = {
  basic: { name: /^Airplane Mode$/, from: false, to: true },
  description: { name: /^Share across devices$/, from: false, to: true },
  "choice-card": { name: /^Share across devices$/, from: false, to: true },
  disabled: { name: /^Disabled$/, from: false, to: false },
  invalid: { name: /^I agree to the terms$/, from: false, to: true },
  controlled: { name: /^Wi-Fi$/, from: true, to: false },
  "read-only": { name: /^Encrypt backups$/, from: true, to: true },
  form: { name: /^Marketing emails$/, from: false, to: true },
  async: { name: /^Automatic backups$/, from: false, to: true },
}
const order = Object.keys(press)

for (const framework of frameworks) {
  test(`every switch example works in ${framework}`, async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
    await page.goto(`/docs/${framework}/components/switch`)
    const previews = page.locator("[data-example]")
    await expect(previews).toHaveCount(order.length)
    for (const folder of folders)
      expect(examplesIn(folder).sort(), folder).toEqual([...order, "size", "rtl", "render"].sort())

    for (const [index, name] of order.entries()) {
      const { name: label, from, to } = press[name]
      const control = previews.nth(index).getByRole("switch", { name: label })
      await expect(control, `${name} starts`).toHaveAttribute("aria-checked", String(from))
      await control.click({ force: name === "disabled" })
      // The async example waits for a fake save before it turns on.
      await expect(control, `${name} after a press`).toHaveAttribute("aria-checked", String(to))
    }

    // Submitting without the required switch shows the error.
    const invalid = previews.nth(order.indexOf("invalid"))
    const terms = invalid.getByRole("switch", { name: /^I agree to the terms$/ })
    await terms.click()
    await expect(terms).toHaveAttribute("aria-checked", "false")
    await invalid.getByRole("button", { name: "Continue" }).click()
    await expect(invalid.getByText("You must agree to the terms to continue.")).toBeVisible()
    await expect(terms).toHaveAttribute("aria-invalid", "true")

    // The controller toggles the switch from outside.
    const controlled = previews.nth(order.indexOf("controlled"))
    await controlled.getByRole("button", { name: "Toggle from outside" }).click()
    await expect(controlled.getByRole("switch", { name: /^Wi-Fi$/ })).toHaveAttribute("aria-checked", "true")
    await expect(controlled.getByText(/last change: imperative/)).toBeVisible()

    // Saving submits the switches that are on, with the one outside the form, and Reset restores them.
    const form = previews.nth(order.indexOf("form"))
    await form.getByRole("switch", { name: /^Join the beta$/ }).click()
    await form.getByRole("button", { name: "Save" }).click()
    await expect(form.getByText("Submitted: marketing=on, security=on, digest=weekly, beta=on")).toBeVisible()
    await form.getByRole("button", { name: "Reset" }).click()
    await expect(form.getByRole("switch", { name: /^Marketing emails$/ })).toHaveAttribute(
      "aria-checked",
      "false",
    )
    await expect(form.getByRole("switch", { name: /^Join the beta$/ })).toHaveAttribute(
      "aria-checked",
      "false",
    )
    await expect(form.getByRole("switch", { name: /^Weekly digest$/ })).toHaveAttribute(
      "aria-checked",
      "true",
    )

    expect(errors).toEqual([])
  })
}
