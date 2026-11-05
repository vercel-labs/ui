import { expect, type Locator } from "@playwright/test"
import { test } from "./docs-test"
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

// The lines an example logged to its console, oldest first.
const logs = (preview: Locator) =>
  preview.locator("xpath=ancestor::figure[1]").locator('section[aria-label="Console"] li:not([aria-hidden])')

// The order examples appear on the Button page.
const order = [
  "basic",
  "pending",
  "pending-content",
  "render",
  "disabled",
  "focusable-when-disabled",
  "link",
  "form",
]
// Right-to-left examples stay in the folders but are off the page for now.
const fixtures = [...order, "rtl"]
const failure = "Couldn't save. Check your connection and try again."

for (const framework of frameworks) {
  test(`every button example works in ${framework}`, async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
    await page.goto(`/docs/${framework}/components/button`)
    const previews = page.locator("[data-example]")
    await expect(previews).toHaveCount(order.length)
    expect(
      await previews.evaluateAll((previews) =>
        previews.map((preview) => preview.getAttribute("data-example")),
      ),
    ).toEqual(order.map((name) => `button/${name}`))
    for (const folder of folders) expect(examplesIn(folder).sort(), folder).toEqual([...fixtures].sort())
    const example = (name: string) => page.locator(`[data-example="button/${name}"]`)

    // A press, Enter and Space each press the button once.
    const counter = example("basic")
    const button = counter.getByRole("button", { name: /^Button$/ })
    await expect(logs(counter)).toHaveCount(0)
    await button.click()
    await expect(logs(counter)).toHaveText(["Pressed"])
    await button.focus()
    await page.keyboard.press("Enter")
    await expect(logs(counter)).toHaveCount(2)
    await page.keyboard.press(" ")
    await expect(logs(counter)).toHaveText(["Pressed", "Pressed", "Pressed"])

    // The basic button sits in the middle of its preview.
    const preview = await counter.boundingBox()
    const basic = await button.boundingBox()
    expect(Math.abs(basic!.x + basic!.width / 2 - (preview!.x + preview!.width / 2))).toBeLessThan(2)

    // A pending button is busy until its Promise settles.
    // It keeps focus meanwhile, and a second press doesn't start it again.
    const save = example("pending").getByRole("button", { name: /^Save$/ })
    await save.click()
    await expect(save).toHaveAttribute("aria-busy", "true")
    await expect(save).not.toHaveAttribute("aria-busy", "true")
    await save.focus()
    const pressed = Date.now()
    await page.keyboard.press("Enter")
    await expect(save).toHaveAttribute("aria-busy", "true")
    await page.waitForTimeout(500)
    await page.keyboard.press("Enter")
    await expect(save).toBeFocused()
    await expect(save).not.toHaveAttribute("aria-busy", "true")
    expect(Date.now() - pressed).toBeLessThan(2300)

    // Its arrow turns into a spinner only meanwhile.
    const download = example("pending-content").getByRole("button", { name: /^Save$/ })
    const spinner = download.locator('[data-show="pending"]')
    const arrow = download.locator('[data-show="idle"]')
    await expect(spinner).toBeHidden()
    await expect(arrow).toBeVisible()
    await download.click()
    await expect(download).toHaveAttribute("aria-busy", "true")
    await expect(spinner).toBeVisible()
    await expect(arrow).toBeHidden()
    await expect(download).not.toHaveAttribute("aria-busy", "true")
    await expect(spinner).toBeHidden()
    await expect(arrow).toBeVisible()

    // The label follows the state, and a failed save keeps its retry label until the next press.
    const render = example("render")
    const action = render.getByRole("button")
    await expect(action).toHaveAccessibleName("Save Changes")
    await action.click()
    await expect(action).toHaveAccessibleName("Saving…")
    await expect(action).toHaveAccessibleName("Try Again")
    await expect(logs(render)).toHaveText([failure])
    await action.click()
    await expect(action, "the next press clears the error").toHaveAccessibleName("Saving…")
    await expect(action).toHaveAccessibleName("Try Again")
    await expect(logs(render)).toHaveText([failure, failure])

    // A disabled button can't be pressed.
    await expect(example("disabled").getByRole("button", { name: /^Disabled$/ })).toBeDisabled()

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
    await expect(logs(focusable), "a disabled press does nothing").toHaveCount(0)
    await focusable.getByRole("textbox", { name: "Title" }).fill("Release notes")
    await expect(publish).toBeEnabled()
    await expect(publish).toHaveAccessibleDescription("Ready to publish.")
    await publish.click()
    await expect(logs(focusable)).toHaveText(["Published “Release notes”"])

    // A link stays a link and navigates, unless it's disabled.
    const link = example("link")
    const changelog = link.getByRole("link", { name: /^Changelog$/ })
    await expect(changelog).toHaveAttribute("aria-disabled", "true")
    await expect(changelog).toHaveAttribute("tabindex", "-1")
    await changelog.click({ force: true })
    expect(page.url()).not.toContain("#changelog")
    const start = link.getByRole("link", { name: /^Get Started$/ })
    await expect(start).toHaveAttribute("href", "#installation")
    await expect(start).not.toHaveAttribute("type")
    await start.click()
    await expect(page).toHaveURL(/#installation$/)

    // Clicking Subscribe and pressing Enter both submit the field's current value.
    const form = example("form")
    const email = form.getByRole("textbox", { name: "Email" })
    await email.fill("user@example.com")
    await form.getByRole("button", { name: /^Subscribe$/ }).click()
    await expect(logs(form)).toHaveText(["Subscribed user@example.com"])
    await email.focus()
    await page.keyboard.press("Enter")
    await expect(logs(form)).toHaveText(["Subscribed user@example.com", "Subscribed user@example.com"])
    await form.getByRole("button", { name: /^Reset$/ }).click()
    await expect(email).toHaveValue("ada@example.com")

    expect(errors).toEqual([])
  })
}
