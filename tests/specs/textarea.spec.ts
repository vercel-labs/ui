import { expect, test } from "../fixtures"
import { fillRequired, saves, status, textbox } from "./form.helpers"

// Textarea is a native multi-line field wired to its Field. With autoResize,
// it grows and shrinks with its text, between its CSS min and max heights.
// With submitShortcut, a key submits its form.

const height = (page: import("@playwright/test").Page) =>
  textbox(page, "Bio").evaluate((el) => el.getBoundingClientRect().height)

test("the label names the textarea and the description describes it", async ({ page, open }) => {
  await open("form")
  await expect(textbox(page, "Bio")).toHaveAccessibleDescription("A few words about you.")
})

test.describe("auto resize", { tag: "@enhancement" }, () => {
  test.beforeEach(async ({ open }) => {
    await open("form")
  })

  test("grows with its text and shrinks back", async ({ page }) => {
    const empty = await height(page)
    await textbox(page, "Bio").fill("One\nTwo\nThree")
    await expect.poll(() => height(page)).toBeGreaterThan(empty + 30)
    await textbox(page, "Bio").fill("")
    await expect.poll(() => height(page)).toBe(empty)
  })

  test("stops at its max height and scrolls", async ({ page }) => {
    await textbox(page, "Bio").fill(Array.from({ length: 20 }, (_, index) => `Line ${index}`).join("\n"))
    await expect.poll(() => height(page)).toBe(110)
    const scrolls = await textbox(page, "Bio").evaluate((el) => el.scrollHeight > el.clientHeight)
    expect(scrolls).toBe(true)
  })

  test("shrinks back when a reset empties it", async ({ page }) => {
    const empty = await height(page)
    await textbox(page, "Bio").fill("One\nTwo\nThree")
    await expect.poll(() => height(page)).toBeGreaterThan(empty)
    await page.getByRole("button", { name: "Reset" }).click()
    await expect.poll(() => height(page)).toBe(empty)
  })

  test("follows text written from code", async ({ page }) => {
    const empty = await height(page)
    await textbox(page, "Bio").evaluate((el: HTMLTextAreaElement) => (el.value = "One\nTwo\nThree"))
    await expect.poll(() => height(page)).toBeGreaterThan(empty + 30)
  })
})

test.describe("submit shortcut", { tag: "@enhancement" }, () => {
  test("without a submit shortcut, Enter starts a new line and doesn't submit", async ({ page, open }) => {
    await open("form")
    await fillRequired(page)
    await textbox(page, "Bio").press("Enter")
    await expect(textbox(page, "Bio")).toHaveValue("\n")
    expect(await saves(page)).toBe(0)
  })

  test("with enter, Enter submits the form and Shift+Enter starts a new line", async ({ page, open }) => {
    await open("form", { "submit-shortcut": "enter" })
    await fillRequired(page)
    await textbox(page, "Bio").pressSequentially("Hi")
    await textbox(page, "Bio").press("Shift+Enter")
    await textbox(page, "Bio").pressSequentially("there")
    await expect(textbox(page, "Bio")).toHaveValue("Hi\nthere")
    expect(await saves(page)).toBe(0)
    await textbox(page, "Bio").press("Enter")
    await expect(status(page, "Submitted")).toHaveText(/bio=Hi(%0D)?%0Athere/)
    await expect(textbox(page, "Bio")).toHaveValue("Hi\nthere")
  })

  test("with mod+enter, Enter starts a new line and Cmd or Ctrl+Enter submits", async ({ page, open }) => {
    await open("form", { "submit-shortcut": "mod+enter" })
    await fillRequired(page)
    await textbox(page, "Bio").pressSequentially("Hi")
    await textbox(page, "Bio").press("Enter")
    await textbox(page, "Bio").pressSequentially("there")
    await expect(textbox(page, "Bio")).toHaveValue("Hi\nthere")
    expect(await saves(page)).toBe(0)
    await textbox(page, "Bio").press("ControlOrMeta+Enter")
    await expect(status(page, "Submitted")).toHaveText(/bio=Hi(%0D)?%0Athere/)
  })

  test("Enter while an input method composes doesn't submit", async ({ page, open, browserName }) => {
    test.skip(browserName !== "chromium", "Only Chromium can drive an input method.")
    await open("form", { "submit-shortcut": "enter" })
    await fillRequired(page)
    await textbox(page, "Bio").focus()
    const session = await page.context().newCDPSession(page)
    await session.send("Input.imeSetComposition", { text: "に", selectionStart: 1, selectionEnd: 1 })
    await page.keyboard.press("Enter")
    await session.send("Input.insertText", { text: "日本" })
    // CDP's stand-in input method doesn't consume the Enter, so it also adds a line.
    await expect(textbox(page, "Bio")).toHaveValue(/^日本/)
    expect(await saves(page)).toBe(0)
  })
})
