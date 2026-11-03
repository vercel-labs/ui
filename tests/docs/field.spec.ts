import { expect, test, type Locator } from "@playwright/test"
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

// The order examples appear on the Field page, and what to do in each.
const checks: Record<string, Check> = {
  input: fill("Username", "grace"),
  textarea: fill("Feedback", "Fast and clear."),
  select: async (preview) => {
    const select = preview.getByRole("combobox", { name: "Department" })
    await select.selectOption("design")
    await expect(select).toHaveValue("design")
  },
  "wrapping-label": async (preview) => {
    const alerts = preview.getByRole("checkbox", { name: /^Usage alerts/ })
    await preview.getByText("Email the team when usage passes its limit.").click()
    await expect(alerts).toHaveAttribute("aria-checked", "true")
    await expect(alerts).toHaveAccessibleDescription("Email the team when usage passes its limit.")
  },
  validation: async (preview) => {
    // Custom elements keep error parts that aren't shown, hidden.
    await expect(preview.getByText("Enter your email address.")).toBeHidden()
    await preview.getByRole("button", { name: "Subscribe" }).click()
    await expect(preview.getByText("Enter your email address.")).toBeVisible()
    await preview.getByRole("textbox", { name: "Email" }).fill("nope")
    await expect(preview.getByText("Enter an email address like m@example.com.")).toBeVisible()
    // Custom elements keep error parts that aren't shown, hidden.
    await expect(preview.getByText("Enter your email address.")).toBeHidden()
  },
  "server-error": async (preview) => {
    await preview.getByRole("button", { name: "Create account" }).click()
    await expect(preview.getByText("This email is already registered.")).toBeVisible()
    await preview.getByRole("textbox", { name: "Email" }).fill("grace@example.com")
    await expect(preview.getByText("This email is already registered.")).toHaveCount(0)
    await preview.getByRole("button", { name: "Create account" }).click()
    await expect(preview).toContainText("Account created for grace@example.com.")
  },
  "character-count": async (preview) => {
    await preview.getByRole("textbox", { name: "Bio" }).fill("Hello")
    await expect(preview).toContainText("5 / 280")
  },
  "sign-up": async (preview) => {
    await preview.getByRole("button", { name: "Submit" }).click()
    await expect(preview.getByText("Enter your name.")).toBeVisible()
    await preview.getByRole("textbox", { name: "Name" }).fill("Ada")
    await preview.getByRole("textbox", { name: "Email" }).fill("ada@example.com")
    await preview.getByLabel("Password", { exact: true }).fill("secret123")
    await preview.getByRole("radio", { name: /^Pro/ }).click()
    await preview.getByRole("checkbox", { name: "I accept the terms of service" }).click()
    await preview.getByRole("button", { name: "Submit" }).click()
    await expect(preview).toContainText("plan: pro")
    await expect(preview).toContainText("terms: on")
    await preview.getByRole("button", { name: "Reset" }).click()
    await expect(preview.getByRole("textbox", { name: "Name" })).toHaveValue("")
    await expect(preview.getByRole("checkbox", { name: "I accept the terms of service" })).toHaveAttribute(
      "aria-checked",
      "false",
    )
  },
  "field-set": fill("Street address", "1 Main St"),
  "field-set-disabled": async (preview) => {
    await expect(preview.getByRole("textbox", { name: "City" })).toBeDisabled()
    await preview.getByRole("switch").click()
    await expect(preview.getByRole("textbox", { name: "City" })).toBeEnabled()
  },
  "field-set-checkboxes": async (preview) => {
    const comments = preview.getByRole("checkbox", { name: "Comments on your posts" })
    await comments.click()
    await expect(comments).toHaveAttribute("aria-checked", "true")
  },
  "field-set-radios": async (preview) => {
    await preview.getByRole("radio", { name: /Yearly/ }).click()
    await expect(preview.getByRole("radio", { name: /Yearly/ })).toHaveAttribute("aria-checked", "true")
  },
}
const order = Object.keys(checks)
const fixtures = [...order, "checkbox", "radio", "switch", "choice-card", "rtl", "field-set-rtl"]

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
