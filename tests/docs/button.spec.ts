import { expect, test } from "@playwright/test"
import { readdirSync } from "node:fs"
import path from "node:path"

const frameworks = ["react", "vue", "svelte", "web-components", "solid"]
// Every framework folder must have the same examples.
const root = path.join(import.meta.dirname, "../../examples/components/button")
const folders = ["react", "vue", "svelte", "web", "solid"]
const examplesIn = (folder: string) =>
  readdirSync(path.join(root, folder), { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name.replace(/\.\w+$/, ""))

// Every fixture, and the button to press in it. Links, disabled buttons and
// the examples that wait are checked below.
const press: Record<string, RegExp | undefined> = {
  basic: /^Button$/,
  outline: /^Outline$/,
  secondary: /^Secondary$/,
  ghost: /^Ghost$/,
  destructive: /^Delete$/,
  "link-style": /^Resend code$/,
  icon: /^Download$/,
  "with-icon": /^New project$/,
  size: /^Small$/,
  rounded: /^Subscribe$/,
  group: /^Archive$/,
  disabled: undefined,
  rtl: /^متابعة$/,
  pending: undefined,
  "focusable-when-disabled": undefined,
  link: undefined,
  form: undefined,
  render: undefined,
}
const examples = Object.keys(press)
const rendered = ["basic", "pending", "render", "disabled", "focusable-when-disabled", "link", "form"]
const failure = "Couldn't save. Check your connection and try again."

for (const framework of frameworks) {
  test(`every button example works in ${framework}`, async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
    await page.goto(`/docs/${framework}/components/button`)
    const previews = page.locator("[data-example]")
    const shown = rendered
    await expect(previews).toHaveCount(shown.length)
    expect(
      await previews.evaluateAll((previews) =>
        previews.map((preview) => preview.getAttribute("data-example")).sort(),
      ),
    ).toEqual(shown.map((name) => `button/${name}`).sort())
    for (const folder of folders) expect(examplesIn(folder).sort(), folder).toEqual([...examples].sort())
    const example = (name: string) => page.locator(`[data-example="button/${name}"]`)

    await expect(example("basic").getByRole("status")).toHaveText("Pressed 0 times")

    for (const name of shown) {
      const label = press[name]
      if (!label) continue
      const button = example(name).getByRole("button", { name: label })
      await expect(button, name).toBeEnabled()
      await button.click()
    }

    const counter = example("basic")
    await expect(counter.getByRole("status")).toHaveText("Pressed 1 time")
    await counter.getByRole("button", { name: /^Button$/ }).focus()
    await page.keyboard.press("Enter")
    await expect(counter.getByRole("status")).toHaveText("Pressed 2 times")
    await page.keyboard.press(" ")
    await expect(counter.getByRole("status")).toHaveText("Pressed 3 times")

    // The basic button sits in the middle of its preview.
    const preview = await example("basic").boundingBox()
    const basic = await example("basic").getByRole("button").boundingBox()
    expect(Math.abs(basic!.x + basic!.width / 2 - (preview!.x + preview!.width / 2))).toBeLessThan(2)

    // A disabled button can't be pressed.
    await expect(example("disabled").getByRole("button", { name: /^Disabled$/ })).toBeDisabled()

    // A pending button is busy until its Promise settles.
    // It keeps focus meanwhile, and a second press doesn't start it again.
    const save = example("pending").getByRole("button", { name: /^Save$/ })
    // Its spinner shows only meanwhile.
    const spinner = save.locator("svg")
    await expect(spinner).toBeHidden()
    await save.click()
    await expect(save).toHaveAttribute("aria-busy", "true")
    await expect(spinner).toBeVisible()
    await expect(save).not.toHaveAttribute("aria-busy", "true")
    await expect(spinner).toBeHidden()
    await save.focus()
    const pressed = Date.now()
    await page.keyboard.press("Enter")
    await expect(save).toHaveAttribute("aria-busy", "true")
    await page.waitForTimeout(500)
    await page.keyboard.press("Enter")
    await expect(save).toBeFocused()
    await expect(save).not.toHaveAttribute("aria-busy", "true")
    expect(Date.now() - pressed).toBeLessThan(2300)

    // Disabled until there's a title, and it stays focusable meanwhile.
    const focusable = example("focusable-when-disabled")
    const publish = focusable.getByRole("button", { name: /^Publish$/ })
    await expect(publish).toBeDisabled()
    await expect(publish).toHaveAccessibleDescription("Add a title to publish.")
    await focusable.getByRole("textbox", { name: "Title" }).focus()
    await page.keyboard.press("Tab")
    await expect(publish).toBeFocused()
    await page.keyboard.press("Enter")
    await page.keyboard.press(" ")
    await publish.click({ force: true })
    await expect(focusable.getByText("Add a title to publish.")).toBeVisible()
    await focusable.getByRole("textbox", { name: "Title" }).fill("Release notes")
    await expect(publish).toBeEnabled()
    await publish.click()
    await expect(focusable.getByText("Published.")).toBeVisible()

    // A link stays a link and navigates, unless it's disabled.
    const link = example("link")
    const changelog = link.getByRole("link", { name: /^Changelog$/ })
    await expect(changelog).toHaveAttribute("aria-disabled", "true")
    await expect(changelog).toHaveAttribute("tabindex", "-1")
    await changelog.click({ force: true })
    expect(page.url()).not.toContain("#changelog")
    const start = link.getByRole("link", { name: /^Get started$/ })
    await expect(start).toHaveAttribute("href", "#installation")
    await expect(start).not.toHaveAttribute("type")
    await start.click()
    await expect(page).toHaveURL(/#installation$/)

    const form = example("form")
    const subscribe = form.getByRole("button", { name: /^Subscribe$/ })
    // Clicking Submit and pressing Enter both submit the field's current value.
    await form.getByRole("textbox", { name: "Email" }).fill("user@example.com")
    await subscribe.click()
    await expect(form.getByRole("status")).toHaveText("Submitted: user@example.com (1 time)")
    await form.getByRole("textbox", { name: "Email" }).focus()
    await page.keyboard.press("Enter")
    await expect(form.getByRole("status")).toHaveText("Submitted: user@example.com (2 times)")
    await form.getByRole("button", { name: /^Reset$/ }).click()
    await expect(form.getByText(/^Submitted:/)).toBeHidden()
    await expect(form.getByRole("textbox", { name: "Email" })).toHaveValue("ada@example.com")
    await expect(form.getByRole("status")).toHaveText("")

    // The label follows the state, and a failed save shows its error until the next press.
    const render = example("render")
    const action = render.getByRole("button")
    await expect(action).toHaveAccessibleName("Save changes")
    await action.click()
    await expect(action).toHaveAccessibleName("Saving…")
    await expect(action).toHaveAccessibleName("Save changes")
    const fail = render.getByRole("checkbox", { name: "Make saving fail" })
    await fail.click()
    await expect(fail).toBeChecked()
    await action.click()
    await expect(render.getByRole("alert")).toHaveText(failure)
    await expect(action).toHaveAccessibleName("Try again")
    await fail.click()
    await expect(fail).not.toBeChecked()
    await action.click()
    await expect(render.getByText(failure)).toBeHidden()
    await expect(action).toHaveAccessibleName("Save changes")

    expect(errors).toEqual([])
  })
}
