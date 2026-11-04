import { expect, type Locator } from "@playwright/test"
import { testExamples, type Check } from "./docs-helpers"

const toggleNamed = (preview: Locator, name: string) => preview.getByRole("button", { name, exact: true })

const pressed = (toggle: Locator, value: boolean) =>
  expect(toggle).toHaveAttribute("aria-pressed", String(value))

// Clicks a toggle, then presses Space and Enter on it, and checks each flips it.
const flips =
  (name: string, from = false): Check =>
  async (preview) => {
    const toggle = toggleNamed(preview, name)
    await pressed(toggle, from)
    await toggle.click()
    await pressed(toggle, !from)
    await toggle.press("Space")
    await pressed(toggle, from)
    await toggle.press("Enter")
    await pressed(toggle, !from)
  }

// Each example's check, in the order they appear on the Toggle page.
const checks: Record<string, Check> = {
  basic: async (preview) => {
    await expect(preview.getByRole("heading", { name: "Q3 Roadmap" })).toBeVisible()
    await flips("Star")(preview, "")
    await expect(toggleNamed(preview, "Star")).toHaveAttribute("type", "button")
  },
  group: async (preview) => {
    await expect(preview.getByRole("group", { name: "Text formatting" })).toBeVisible()
    const bold = toggleNamed(preview, "Bold")
    const italic = toggleNamed(preview, "Italic")
    const underline = toggleNamed(preview, "Underline")
    await bold.click()
    await italic.click()
    await pressed(bold, true)
    await pressed(italic, true)
    // Arrow keys move focus without pressing, and wrap at the ends.
    await bold.focus()
    await bold.press("End")
    await expect(underline).toBeFocused()
    await pressed(underline, false)
    await underline.press("ArrowRight")
    await expect(bold).toBeFocused()
    await bold.press("ArrowRight")
    await expect(italic).toBeFocused()
    await italic.press("Space")
    await pressed(italic, false)
    await pressed(bold, true)
  },
  "group-single": async (preview) => {
    const start = toggleNamed(preview, "Align start")
    const center = toggleNamed(preview, "Align center")
    await pressed(start, true)
    await center.click()
    await pressed(center, true)
    await pressed(start, false)
    // deselectable={false} keeps the last alignment pressed.
    await center.click()
    await pressed(center, true)
    await center.press("ArrowRight")
    await expect(toggleNamed(preview, "Align end")).toBeFocused()
    await pressed(center, true)
  },
  render: async (preview) => {
    await flips("Favorite")(preview, "")
    await expect(preview.locator("svg")).toHaveAttribute("fill", "currentColor")
  },
}

// Every check reads its own example, since each example's Code panel stays mounted.
const scoped = Object.fromEntries(
  Object.entries(checks).map(([name, check]): [string, Check] => [
    name,
    (preview, framework) => check(preview.page().locator(`[data-example="toggle/${name}"]`), framework),
  ]),
)

// The folders also keep the right-to-left demos and the First Component demo, which are off this page.
testExamples("toggle", scoped, "components", [...Object.keys(checks), "rtl", "group-rtl", "first-component"])
