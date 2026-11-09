import { expect, type Locator } from "@playwright/test"
import { type Check, testExamples } from "./docs-helpers"

// The newest line in an example's console.
const lastLog = (preview: Locator) =>
  preview
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()

const editorIn = (preview: Locator) =>
  preview.locator('[data-slot="token-input-editor"]')
const tokensIn = (preview: Locator) =>
  editorIn(preview).locator("[data-token-id]")

// Puts the caret just after the first token, past the anchor that follows it.
const caretAfterFirstToken = (preview: Locator) =>
  editorIn(preview).evaluate((editor) => {
    const anchor = editor.querySelector("[data-token-id]")!.nextSibling!
    const range = document.createRange()
    range.setStart(anchor, 1)
    const selection = getSelection()!
    selection.removeAllRanges()
    selection.addRange(range)
  })

// Each check runs on its own example, found by name.
const example =
  (name: string, check: Check): Check =>
  async (preview, framework) => {
    await expect(preview).toHaveAttribute("data-example", `token-input/${name}`)
    await preview.scrollIntoViewIfNeeded()
    await check(preview, framework)
  }

testExamples("token-input", {
  demo: example("demo", async (preview) => {
    const page = preview.page()
    const editor = preview.getByRole("textbox", { name: "Message" })
    const label = preview.getByText("Message", { exact: true })
    const top = (await label.boundingBox())!.y
    await editor.click()
    for (const query of ["hol", "ine", "kof"]) {
      await page.keyboard.type(`@${query}`)
      await expect(page.getByRole("listbox").last()).toBeVisible()
      await page.keyboard.press("Enter")
    }
    await expect(tokensIn(preview)).toHaveCount(3)
    await expect(tokensIn(preview).last()).toContainText("Kofi Mensah")
    await page.keyboard.press("Backspace")
    await page.keyboard.press("Backspace")
    await expect(tokensIn(preview)).toHaveCount(2)
    await preview
      .locator('[data-slot="token-input-token-remove"]')
      .first()
      .click()
    await expect(tokensIn(preview)).toHaveCount(1)
    await expect(tokensIn(preview)).toContainText("Inès Moreau")
    await expect(editor).toBeFocused()
    expect((await label.boundingBox())!.y).toBe(top)
  }),
  "prompt-input": example("prompt-input", async (preview) => {
    const page = preview.page()
    await preview.getByRole("textbox", { name: "Prompt" }).click()
    await page.keyboard.type("@rou")
    await page.keyboard.press("Enter")
    await expect(tokensIn(preview)).toHaveCount(1)
    await expect(tokensIn(preview).first()).not.toHaveAttribute("data-pending")
    await page.keyboard.press("Enter")
    await expect(lastLog(preview)).toHaveText(
      "Sent [@routes.ts](file:src/routes.ts)"
    )
    await expect(tokensIn(preview)).toHaveCount(0)
  }),
  deletion: example("deletion", async (preview) => {
    const page = preview.page()
    await editorIn(preview).click()
    await caretAfterFirstToken(preview)
    await page.keyboard.press("Backspace")
    await expect(tokensIn(preview)).toHaveCount(0)
    await expect(lastLog(preview)).toHaveText("Removed routes.ts (whole)")
    await page.keyboard.press("ControlOrMeta+z")
    await expect(tokensIn(preview)).toHaveCount(1)

    await preview.getByRole("combobox").click()
    await page.getByRole("option", { name: "Select" }).click()
    await editorIn(preview).click()
    await caretAfterFirstToken(preview)
    await page.keyboard.press("Backspace")
    await expect(tokensIn(preview).first()).toHaveAttribute("data-selected")
    await page.keyboard.press("Backspace")
    await expect(tokensIn(preview)).toHaveCount(0)
    await expect(lastLog(preview)).toHaveText("Removed routes.ts (select)")
  }),
  codec: example("codec", async (preview) => {
    const page = preview.page()
    await expect(tokensIn(preview)).toHaveCount(2)
    await editorIn(preview).click()
    await page.keyboard.press("ControlOrMeta+End")
    await page.keyboard.type("!")
    await expect(lastLog(preview)).toHaveText(
      "Ping <@hollis> and <@ines> about the launch!"
    )
  }),
  form: example("form", async (preview) => {
    const page = preview.page()
    await expect(
      preview.locator("form [data-slot='token-input-editor']")
    ).toHaveCount(0)
    const submitted =
      "Submitted Explain [@routes.ts](file:src/routes.ts) in two sentences."
    await preview.getByRole("button", { name: "Submit" }).click()
    await expect(lastLog(preview)).toHaveText(submitted)
    await preview.getByRole("textbox", { name: "Prompt" }).click()
    await page.keyboard.press("ControlOrMeta+End")
    await page.keyboard.type(" Keep it short.")
    await page.keyboard.press("Enter")
    await expect(lastLog(preview)).toHaveText(
      submitted.replace("sentences.", "sentences. Keep it short.")
    )
  }),
  controlled: example("controlled", async (preview) => {
    const page = preview.page()
    await preview.getByRole("textbox", { name: "Prompt" }).click()
    await page.keyboard.press("ControlOrMeta+End")
    await page.keyboard.type(" @app")
    await expect(page.getByRole("listbox").last()).toBeVisible()
    await page.keyboard.press("Enter")
    await expect(tokensIn(preview)).toHaveCount(2)
    await expect(lastLog(preview)).toContainText(
      "[@app.tsx](file:src/app.tsx) (item-press)"
    )
  }),
  controller: example("controller", async (preview) => {
    await preview.getByRole("button", { name: "Attach File" }).click()
    await expect(tokensIn(preview)).toHaveCount(2)
    await expect(tokensIn(preview).last()).not.toHaveAttribute("data-pending")
    await preview.getByRole("button", { name: "Show Path" }).click()
    await expect(tokensIn(preview).first()).toContainText("src/routes.ts")
    await preview.getByRole("button", { name: "Remove First" }).click()
    await expect(tokensIn(preview)).toHaveCount(1)
    await preview.getByRole("button", { name: "Undo" }).click()
    await expect(tokensIn(preview)).toHaveCount(2)
    await preview.getByRole("button", { name: "Clear" }).click()
    await expect(editorIn(preview)).toHaveAttribute("data-empty")
  }),
  "submit-shortcut": example("submit-shortcut", async (preview) => {
    const page = preview.page()
    await preview.getByRole("textbox", { name: "Message" }).click()
    await page.keyboard.type("Lunch at noon?")
    await page.keyboard.press("Enter")
    await page.keyboard.type("Hollis is booking.")
    await page.keyboard.press("ControlOrMeta+Enter")
    await expect(lastLog(preview)).toHaveText(
      /^Sent Lunch at noon\?\s+Hollis is booking\.$/
    )
  }),
})
