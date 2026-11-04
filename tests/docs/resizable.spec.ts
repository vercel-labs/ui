import { expect, type Locator } from "@playwright/test"
import { testExamples, type Check } from "./docs-helpers"

// The newest line in an example's console.
const lastLog = (preview: Locator) =>
  preview
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()

const handle = (preview: Locator, name: string) => preview.getByRole("separator", { name, exact: true })

// Focuses a handle, presses a key, and checks the panel before it grew by `by`.
const moves =
  (name: string, key = "ArrowRight", by = 1): Check =>
  async (preview) => {
    const separator = handle(preview, name)
    await expect(separator, `${name} lays its panels out`).toHaveAttribute("aria-valuenow", /^\d+$/)
    const from = Number(await separator.getAttribute("aria-valuenow"))
    await separator.focus()
    await preview.page().keyboard.press(key)
    await expect(separator, `${name} after ${key}`).toHaveAttribute("aria-valuenow", String(from + by))
  }

// Each example's check, in the order they appear on the Resizable page.
const checks: Record<string, Check> = {
  basic: async (preview, framework) => {
    await moves("Resize files")(preview, framework)
    await moves("Resize editor", "ArrowDown")(preview, framework)
  },
  vertical: moves("Resize inbox", "ArrowDown"),
  handle: moves("Resize channels"),
  collapsible: async (preview, framework) => {
    await moves("Resize sidebar")(preview, framework)
    const sidebar = preview.locator('[data-slot="resizable-panel"]').first()
    await preview.page().keyboard.press("Enter")
    await expect(sidebar, "Enter collapses the sidebar").toHaveAttribute("data-collapsed")
    await expect(sidebar.getByText("Files")).toBeHidden()
    await preview.page().keyboard.press("Enter")
    await expect(sidebar).not.toHaveAttribute("data-collapsed")
  },
  sizes: moves("Resize navigation"),
  "default-layout": async (preview, framework) => {
    await expect(handle(preview, "Resize folders")).toHaveAttribute("aria-valuenow", "25")
    await expect(handle(preview, "Resize inbox")).toHaveAttribute("aria-valuenow", "35")
    await moves("Resize folders")(preview, framework)
  },
  controlled: async (preview, framework) => {
    await moves("Resize files")(preview, framework)
    await expect(lastLog(preview)).toHaveText("31 / 69 (step-key)")
    await preview.getByRole("button", { name: "Split Evenly" }).click()
    await expect(handle(preview, "Resize files"), "the application sets the layout").toHaveAttribute(
      "aria-valuenow",
      "50",
    )
    await preview.getByRole("button", { name: "Reset" }).click()
    await expect(handle(preview, "Resize files")).toHaveAttribute("aria-valuenow", "30")
  },
  complete: async (preview, framework) => {
    await moves("Resize files")(preview, framework)
    // Completing saves once, after the key comes up.
    await expect(lastLog(preview)).toHaveText("Saved 41 / 59 (step-key)")
  },
  persistence: moves("Resize outline"),
  storage: moves("Resize messages"),
  controller: async (preview, framework) => {
    await moves("Resize files")(preview, framework)
    // The controller collapses the sidebar from outside.
    await preview.getByRole("button", { name: "Collapse" }).click()
    await expect(handle(preview, "Resize files")).toHaveAttribute("aria-valuenow", "0")
    await preview.getByRole("button", { name: "Read", exact: true }).click()
    await expect(lastLog(preview)).toHaveText("Layout 0 / 100, collapsed")
    await preview.getByRole("button", { name: "Expand" }).click()
    await expect(handle(preview, "Resize files")).toHaveAttribute("aria-valuenow", "31")
  },
  keyboard: async (preview, framework) => {
    await moves("Resize original", "ArrowRight", 5)(preview, framework)
    await preview.page().keyboard.press("Shift+ArrowLeft")
    await expect(handle(preview, "Resize original")).toHaveAttribute("aria-valuenow", "30")
  },
  disabled: async (preview, framework) => {
    // A disabled handle is out of the tab order.
    await expect(handle(preview, "Resize pinned")).not.toHaveAttribute("tabindex")
    await moves("Resize inbox")(preview, framework)
    await preview.getByRole("checkbox", { name: "Lock layout" }).click()
    await expect(handle(preview, "Resize inbox"), "locking fixes every handle").toHaveAttribute(
      "aria-disabled",
      "true",
    )
  },
  render: async (preview, framework) => {
    await expect(preview.getByText("35%")).toBeVisible()
    await moves("Resize files")(preview, framework)
    await expect(preview.getByText("36%")).toBeVisible()
    await preview.page().keyboard.press("Enter")
    await expect(preview.getByText("Collapsed")).toBeAttached()
  },
}

// Every check reads its own example, since each example's Code panel stays mounted.
const scoped = Object.fromEntries(
  Object.entries(checks).map(([name, check]): [string, Check] => [
    name,
    (preview, framework) => check(preview.page().locator(`[data-example="resizable/${name}"]`), framework),
  ]),
)

testExamples("resizable", scoped, "components", [...Object.keys(checks), "rtl"])
