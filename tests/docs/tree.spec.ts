import { expect, type Locator } from "@playwright/test"
import { testExamples, type Check } from "./docs-helpers"

// The last line an example logged to its console.
function lastLog(preview: Locator) {
  return preview
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()
}

const item = (preview: Locator, name: string) =>
  preview.getByRole("treeitem", { name, exact: true })

// The tree is there, named, with one tab stop, and Down moves focus from it.
const roves =
  (name: string): Check =>
  async (preview) => {
    const tree = preview.getByRole("tree", { name }).first()
    await expect(tree).toBeVisible()
    const stop = tree.locator('[role="treeitem"][tabindex="0"]')
    await expect(stop).toHaveCount(1)
    await stop.focus()
    const before = await stop.getAttribute("id")
    await preview.page().keyboard.press("ArrowDown")
    const moved = await preview
      .page()
      .evaluate((id) => document.activeElement?.id !== id, before)
    expect(moved, `${name} moves with ArrowDown`).toBe(true)
  }

const checks: Record<string, Check> = {
  demo: async (preview, framework) => {
    await roves("Files")(preview, framework)
    await item(preview, "components").click()
    await expect(item(preview, "components")).toHaveAttribute(
      "aria-expanded",
      "true"
    )
    await expect(item(preview, "card.tsx")).toBeVisible()
    await expect(item(preview, "components.json")).toBeVisible()
  },
  paths: async (preview) => {
    await item(preview, "tests").focus()
    await preview.page().keyboard.press("ArrowDown")
    await expect(item(preview, "package.json")).toHaveAttribute(
      "aria-selected",
      "true"
    )
    await preview.page().keyboard.press("Enter")
    await expect(lastLog(preview)).toHaveText("Opened package.json")
  },
  multiple: async (preview) => {
    await expect(
      preview.getByRole("tree", { name: "Folders" })
    ).toHaveAttribute("aria-multiselectable", "true")
    await item(preview, "Archive").click({ modifiers: ["ControlOrMeta"] })
    await expect(lastLog(preview)).toHaveText(
      "3 selected: updates, website, archive"
    )
  },
  checkboxes: async (preview) => {
    await item(preview, "Vue").focus()
    await preview.page().keyboard.press("Space")
    await expect(lastLog(preview)).toHaveText("Checked react, vue, postgres")
    await expect(item(preview, "Frontend")).toHaveAttribute(
      "aria-checked",
      "mixed"
    )
  },
  links: async (preview) => {
    // A press moves the current page in the example, and leaves the docs' URL alone.
    const url = preview.page().url()
    await item(preview, "Dialog").click()
    await expect(item(preview, "Dialog")).toHaveAttribute(
      "aria-current",
      "page"
    )
    expect(preview.page().url()).toBe(url)
    // A link row the keyboard reaches shows the focus ring, whatever element the link sits in.
    await preview.page().keyboard.press("ArrowDown")
    const label = item(preview, "Tree").locator('[data-slot="tree-label"]')
    await expect(label).not.toHaveCSS("box-shadow", "none")
  },
  disabled: async (preview, framework) => {
    await roves("Plans")(preview, framework)
    await expect(item(preview, "Enterprise")).toHaveAttribute(
      "aria-disabled",
      "true"
    )
  },
  lazy: async (preview) => {
    await item(preview, "users").click()
    await expect(item(preview, "users")).toHaveAttribute(
      "aria-expanded",
      "true"
    )
    await expect(item(preview, "user_1.json")).toBeVisible()
  },
  virtualized: async (preview) => {
    await item(preview, "Folder 1").focus()
    await preview.page().keyboard.press("End")
    await expect(item(preview, "Folder 100")).toBeFocused()
    await expect(item(preview, "Folder 100")).toHaveAttribute(
      "aria-posinset",
      "100"
    )
  },
  "find-in-page": async (preview) => {
    await expect(
      preview
        .getByRole("tree", { name: "Solar system" })
        .locator('[hidden="until-found"]')
    ).toHaveCount(5)
  },
  controller: async (preview) => {
    await preview.getByRole("button", { name: "Find Two-Factor" }).click()
    await expect(item(preview, "Two-factor authentication")).toBeFocused()
    await preview.getByRole("button", { name: "Collapse All" }).click()
    await expect(item(preview, "Account")).toHaveAttribute(
      "aria-expanded",
      "false"
    )
  },
}

testExamples("tree", checks, "components", [...Object.keys(checks), "rtl"])
