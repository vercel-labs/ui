import { expect } from "@playwright/test"
import { testExamples } from "./docs-helpers"

testExamples(
  "shortcuts",
  {
    basic: async (preview) => {
      // Examples load after the page, so wait for this one before pressing keys.
      await expect(preview.getByText("Press N", { exact: false })).toBeVisible()
      await preview.page().keyboard.press("n")
      await expect(
        preview.getByText("Note created", { exact: true })
      ).toBeVisible()
      await preview.page().keyboard.press("ControlOrMeta+s")
      await expect(preview.getByText("Saved", { exact: true })).toBeVisible()
    },
    scope: async (preview) => {
      const note = preview.getByRole("textbox", { name: "Note" })
      // Outside the note, its scope is off.
      await preview.page().keyboard.press("ControlOrMeta+Enter")
      await expect(
        preview.getByText("Focus the note to turn on its shortcuts.")
      ).toBeVisible()
      await note.fill("Hi")
      await preview.page().keyboard.press("ControlOrMeta+Enter")
      await expect(preview.getByText("Characters saved: 2")).toBeVisible()
      await preview.page().keyboard.press("Escape")
      await expect(preview.getByText("Cleared", { exact: true })).toBeVisible()
      await expect(note).toHaveValue("")
    },
  },
  "utilities"
)
