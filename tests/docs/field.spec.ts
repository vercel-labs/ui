import { expect, type Locator } from "@playwright/test"
import { test } from "./docs-test"
import { readdirSync } from "node:fs"
import path from "node:path"

const frameworks = ["react", "vue", "web-components", "svelte", "solid"]
// Every framework folder must have the same examples.
const root = path.join(import.meta.dirname, "../../examples/components/field")
const folders = ["react", "vue", "web", "svelte", "solid"]
const examplesIn = (folder: string) =>
  readdirSync(path.join(root, folder), { withFileTypes: true })
    .filter((file) => file.isFile())
    .map((file) => file.name.replace(/\.\w+$/, ""))

type Check = (preview: Locator) => Promise<void>

// Types into a text field and checks it kept the value.
const fill =
  (name: string | RegExp, value: string): Check =>
  async (preview) => {
    const box = preview.getByRole("textbox", { name })
    await box.fill(value)
    await expect(box).toHaveValue(value)
  }

// The newest line in an example's console.
const lastLog = (preview: Locator) =>
  preview
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()

// The order examples appear on the Field page, and what to do in each.
const checks: Record<string, Check> = {
  input: fill("Username", "hollis"),
  validation: async (preview) => {
    // Custom elements keep error parts that aren't shown, hidden.
    await expect(preview.getByText("Enter your email address.")).toBeHidden()
    await preview.getByRole("button", { name: "Subscribe" }).click()
    await expect(preview.getByText("Enter your email address.")).toBeVisible()
    await preview.getByRole("textbox", { name: "Email" }).fill("nope")
    await expect(preview.getByText("Enter an email address like hollis@example.com.")).toBeVisible()
    await expect(preview.getByText("Enter your email address.")).toBeHidden()
    await preview.getByRole("textbox", { name: "Email" }).fill("hollis@example.com")
    await preview.getByRole("textbox", { name: "Website" }).fill("https://example.com")
    await preview.getByRole("button", { name: "Subscribe" }).click()
    await expect(lastLog(preview)).toHaveText("Subscribed hollis@example.com")
  },
  "field-set": fill("Street address", "1 Main St"),
}
const order = Object.keys(checks)
const fixtures = [...order, "rtl", "field-set-rtl"]

for (const framework of frameworks) {
  test(`every field example works in ${framework}`, async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
    await page.goto(`/docs/${framework}/components/field`)
    const previews = page.locator("[data-example]")
    await expect(previews).toHaveCount(order.length)
    for (const folder of folders) expect(examplesIn(folder).sort(), folder).toEqual([...fixtures].sort())

    for (const [index, name] of order.entries()) {
      await test.step(name, () => checks[name](previews.nth(index)))
    }

    expect(errors).toEqual([])
  })
}
