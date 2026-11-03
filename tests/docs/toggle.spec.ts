import { expect, test, type Locator } from "@playwright/test"
import { readdirSync } from "node:fs"
import path from "node:path"

const frameworks = ["react", "vue", "svelte", "web-components", "solid"]
// Every framework folder must have the same examples.
const root = path.join(import.meta.dirname, "../../examples/components/toggle")
const folders = ["react", "vue", "svelte", "web", "solid"]
const examplesIn = (folder: string) =>
  readdirSync(path.join(root, folder), { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name.replace(/\.\w+$/, ""))

// The order examples appear on the Toggle page, groups included.
const order = [
  "basic",
  "with-text",
  "disabled",
  "controlled",
  "focusable-when-disabled",
  "group",
  "group-vertical",
  "group-disabled",
  "group-custom",
  "group-rtl",
  "group-single",
  "group-deselectable",
  "group-loop",
  "group-controlled",
  "group-render",
  "render",
]

// The Get Started demo lives outside the component page.
const allExamples = [
  ...order,
  "outline",
  "size",
  "rtl",
  "group-outline",
  "group-size",
  "group-spacing",
  "first-component",
].sort()

// The toggle to press in each single-toggle example, and whether it's pressed
// before and after the press. Disabled toggles stay.
const press: Record<string, { name: RegExp; from: boolean; to: boolean }> = {
  basic: { name: /^Bookmark$/, from: false, to: true },
  outline: { name: /^Italic$/, from: false, to: true },
  "with-text": { name: /^Italic$/, from: false, to: true },
  size: { name: /^Small$/, from: false, to: true },
  disabled: { name: /^Disabled$/, from: false, to: false },
  rtl: { name: /^إشارة مرجعية$/, from: false, to: true },
  controlled: { name: /^Notifications$/, from: true, to: false },
  "focusable-when-disabled": { name: /^Pin to top$/, from: false, to: false },
  render: { name: /^Favorite$/, from: true, to: false },
}
const disabled = new Set(["disabled", "focusable-when-disabled"])

for (const framework of frameworks) {
  test(`every toggle example works in ${framework}`, async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
    await page.goto(`/docs/${framework}/components/toggle`)
    const previews = page.locator("[data-example]")
    await expect(previews).toHaveCount(order.length)
    for (const folder of folders) expect(examplesIn(folder).sort(), folder).toEqual(allExamples)

    for (const [name, { name: label, from, to }] of Object.entries(press).filter(([name]) =>
      order.includes(name),
    )) {
      // The disabled example has two toggles with the same name, so press the first.
      const control = previews.nth(order.indexOf(name)).getByRole("button", { name: label }).first()
      await expect(control, `${name} starts`).toHaveAttribute("aria-pressed", String(from))
      // Playwright won't click a disabled button, or one with aria-disabled, without force.
      await control.click({ force: disabled.has(name) })
      await expect(control, `${name} after a press`).toHaveAttribute("aria-pressed", String(to))
    }

    // Both disabled toggles are disabled.
    const off = previews.nth(order.indexOf("disabled")).getByRole("button", { name: /^Disabled$/ })
    await expect(off).toHaveCount(2)
    for (const toggle of await off.all()) await expect(toggle).toBeDisabled()
    await expect(off.last()).toHaveAttribute("aria-pressed", "true")

    // A toggle that's focusable when disabled stays in the tab order, with aria-disabled.
    const pin = previews
      .nth(order.indexOf("focusable-when-disabled"))
      .getByRole("button", { name: /^Pin to top$/ })
    await expect(pin).toHaveAttribute("aria-disabled", "true")
    await expect(pin).not.toHaveAttribute("disabled")
    await pin.focus()
    await expect(pin).toBeFocused()
    await page.keyboard.press("Space")
    await expect(pin).toHaveAttribute("aria-pressed", "false")

    // The controller presses the toggle from outside, with the imperative reason.
    const controlled = previews.nth(order.indexOf("controlled"))
    const notifications = controlled.getByRole("button", { name: /^Notifications$/ })
    await expect(controlled.getByText("Notifications: off, last change: press")).toBeVisible()
    await controlled.getByRole("button", { name: "Toggle from outside" }).click()
    await expect(notifications).toHaveAttribute("aria-pressed", "true")
    await expect(controlled.getByText("Notifications: on, last change: imperative")).toBeVisible()

    expect(errors).toEqual([])
  })
}

// A toggle found by its exact name. Examples with several groups repeat names,
// so `nth` picks the first or last match.
type Step = {
  // Press the toggle, or only check it.
  action: "press" | "check"
  name: string
  nth?: "first" | "last"
  // The aria-pressed it must have afterwards.
  pressed: "true" | "false"
  // Disabled toggles fail Playwright's enabled check, so they're clicked with force.
  force?: boolean
}

const pressToggle = (name: string, pressed: Step["pressed"], extra: Partial<Step> = {}): Step => ({
  action: "press",
  name,
  pressed,
  ...extra,
})
const checkToggle = (name: string, pressed: Step["pressed"], extra: Partial<Step> = {}): Step => ({
  action: "check",
  name,
  pressed,
  ...extra,
})

// What to press in each group example.
const steps: Record<string, Step[]> = {
  group: [pressToggle("Bold", "true"), pressToggle("Italic", "true"), checkToggle("Bold", "true")],
  "group-outline": [checkToggle("All", "true"), pressToggle("Missed", "true"), checkToggle("All", "false")],
  "group-size": [
    pressToggle("Bold", "true", { nth: "first" }),
    pressToggle("Underline", "true", { nth: "last" }),
  ],
  "group-spacing": [pressToggle("Italic", "true"), pressToggle("Heart", "true")],
  "group-vertical": [pressToggle("Underline", "true")],
  "group-disabled": [
    // The whole group is disabled, with bold pressed.
    checkToggle("Bold", "true", { nth: "first" }),
    pressToggle("Italic", "false", { nth: "first", force: true }),
    // Only underline is disabled in the second group.
    pressToggle("Underline", "false", { nth: "last", force: true }),
    pressToggle("Bold", "true", { nth: "last" }),
  ],
  "group-custom": [
    pressToggle("Medium", "true"),
    checkToggle("Normal", "false"),
    pressToggle("Medium", "true"),
  ],
  "group-rtl": [pressToggle("شبكة", "true"), checkToggle("قائمة", "false")],
  "group-single": [
    pressToggle("Align center", "true"),
    checkToggle("Align left", "false"),
    pressToggle("Align center", "false"),
  ],
  "group-deselectable": [
    pressToggle("Align start", "true"),
    pressToggle("Align end", "true"),
    checkToggle("Align start", "false"),
  ],
  "group-loop": [pressToggle("Bold", "true")],
  "group-controlled": [checkToggle("Bold", "true"), pressToggle("Italic", "true")],
  "group-render": [pressToggle("Like", "true")],
}

function toggleIn(preview: Locator, step: Pick<Step, "name" | "nth">) {
  const matches = preview.getByRole("button", { name: step.name, exact: true })
  return step.nth === "last" ? matches.last() : matches.first()
}

for (const framework of frameworks) {
  test(`every toggle group example works in ${framework}`, async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
    await page.goto(`/docs/${framework}/components/toggle`)
    const previews = page.locator("[data-example]")
    await expect(previews).toHaveCount(order.length)
    for (const folder of folders) expect(examplesIn(folder).sort(), folder).toEqual(allExamples)

    for (const name of Object.keys(steps).filter((name) => order.includes(name))) {
      const preview = previews.nth(order.indexOf(name))
      for (const step of steps[name]) {
        const toggle = toggleIn(preview, step)
        await expect(toggle, `${name}: ${step.name}`).toBeVisible()
        if (step.action === "press") await toggle.click({ force: step.force })
        await expect(toggle, `${name}: ${step.action} ${step.name}`).toHaveAttribute(
          "aria-pressed",
          step.pressed,
        )
      }
    }

    // The controller clears the value, and the status line shows each reason.
    const controlled = previews.nth(order.indexOf("group-controlled"))
    await expect(controlled.getByText(/last change: item-press/)).toBeVisible()
    await controlled.getByRole("button", { name: "Clear", exact: true }).click()
    await expect(toggleIn(controlled, { name: "Bold" })).toHaveAttribute("aria-pressed", "false")
    await expect(toggleIn(controlled, { name: "Italic" })).toHaveAttribute("aria-pressed", "false")
    await expect(controlled.getByText(/Pressed: none, last change: imperative/)).toBeVisible()

    expect(errors).toEqual([])
  })
}

// Arrow keys move focus within a toggle group.
for (const framework of frameworks) {
  test(`toggle group examples move focus with arrow keys in ${framework}`, async ({ page }) => {
    await page.goto(`/docs/${framework}/components/toggle`)
    const previews = page.locator("[data-example]")
    await expect(previews).toHaveCount(order.length)
    const example = (name: string) => previews.nth(order.indexOf(name))

    // Arrow keys move focus without pressing, and wrap at the ends.
    const basic = example("group")
    await toggleIn(basic, { name: "Bold" }).focus()
    await page.keyboard.press("End")
    await expect(toggleIn(basic, { name: "Underline" })).toBeFocused()
    await expect(toggleIn(basic, { name: "Underline" })).toHaveAttribute("aria-pressed", "false")
    await page.keyboard.press("ArrowRight")
    await expect(toggleIn(basic, { name: "Bold" })).toBeFocused()
    await expect(toggleIn(basic, { name: "Bold" })).toHaveAttribute("aria-pressed", "false")

    // With loop off, arrows stop at the last toggle.
    const loop = example("group-loop")
    await toggleIn(loop, { name: "Strikethrough" }).focus()
    await page.keyboard.press("ArrowRight")
    await expect(toggleIn(loop, { name: "Strikethrough" })).toBeFocused()
    await page.keyboard.press("Home")
    await expect(toggleIn(loop, { name: "Bold" })).toBeFocused()

    // A vertical group moves with the down arrow.
    const vertical = example("group-vertical")
    await toggleIn(vertical, { name: "Bold" }).focus()
    await page.keyboard.press("ArrowDown")
    await expect(toggleIn(vertical, { name: "Italic" })).toBeFocused()

    // Right to left, the left arrow moves to the next toggle.
    const rtl = example("group-rtl")
    await toggleIn(rtl, { name: "قائمة" }).focus()
    await page.keyboard.press("ArrowLeft")
    await expect(toggleIn(rtl, { name: "شبكة" })).toBeFocused()

    // Disabled toggles stay reachable.
    const disabled = example("group-disabled")
    await toggleIn(disabled, { name: "Bold", nth: "last" }).focus()
    await page.keyboard.press("End")
    await expect(toggleIn(disabled, { name: "Underline", nth: "last" })).toBeFocused()
    await page.keyboard.press("Space")
    await expect(toggleIn(disabled, { name: "Underline", nth: "last" })).toHaveAttribute(
      "aria-pressed",
      "false",
    )
  })
}
