import { expect, type Locator } from "@playwright/test"
import { testExamples } from "./docs-helpers"

// Checks an example's preview, then how many separators a screen reader finds
// in it and which way they run.
const separators =
  (name: string, count: number, orientation: "horizontal" | "vertical") =>
  async (preview: Locator) => {
    await expect(preview).toHaveAttribute("data-example", `separator/${name}`)
    const found = preview.getByRole("separator")
    await expect(found).toHaveCount(count)
    for (const separator of await found.all()) {
      await expect(separator).toHaveAttribute("aria-orientation", orientation)
    }
  }

// Each example's check, in the order they appear on the Separator page.
testExamples(
  "separator",
  {
    basic: async (preview) => {
      await separators("basic", 1, "horizontal")(preview)
      await expect(preview.getByText("Hollis Grant")).toBeVisible()
    },
    vertical: async (preview) => {
      await separators("vertical", 2, "vertical")(preview)
      await expect(
        preview.getByRole("navigation", { name: "Legal" }).getByRole("link")
      ).toHaveCount(3)
    },
    menu: async (preview) => {
      await separators("menu", 2, "vertical")(preview)
      // Each line runs the full height of the stat beside it, number and label.
      const line = await preview.getByRole("separator").first().boundingBox()
      const stat = await preview
        .getByText("Projects")
        .locator("..")
        .boundingBox()
      expect(Math.round(line!.height)).toBe(Math.round(stat!.height))
    },
    list: async (preview) => {
      await separators("list", 2, "horizontal")(preview)
      await expect(preview.getByText("December 1, 2026")).toBeVisible()
    },
    decorative: async (preview) => {
      await separators("decorative", 0, "horizontal")(preview)
      // The lines are there, just hidden from screen readers.
      await expect(preview.getByText("or", { exact: true })).toBeVisible()
      await expect(
        preview.locator('[role="none"][data-orientation="horizontal"]')
      ).toHaveCount(2)
    },
  },
  "components",
  ["basic", "vertical", "menu", "list", "decorative", "rtl"]
)
