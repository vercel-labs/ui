import type { Page } from "@playwright/test"
import { expect, lastAction, test } from "../fixtures"

// A text field with atomic tokens. The core owns the contenteditable DOM, so
// tokens delete in one keystroke, the caret never lands inside one, and copy
// and paste keep them through plain text. A trigger menu inside it inserts tokens.

const editor = (page: Page) => page.getByRole("textbox", { name: "Prompt" })
const listbox = (page: Page) => page.getByRole("listbox", { name: "Prompt" })
const chips = (page: Page) => page.locator("[data-slot='token-input-token']")
const hosts = (page: Page) => page.locator("[data-slot='token-input-host']")
const submitted = (page: Page) => page.getByRole("status", { name: "Submitted" })
const announcer = (page: Page) => page.locator("[data-ui-sdk-announcer]")
const startValue = "Summarize [@a.ts](file:src/a.ts) please"

// The value as codec text: what a form submits.
async function text(page: Page) {
  return page.evaluate(() => String(new FormData(document.querySelector("form")!).get("prompt")))
}

async function caretToEnd(page: Page) {
  await editor(page).focus()
  await page.keyboard.press("ControlOrMeta+End")
  await editor(page).evaluate((el) => {
    const selection = getSelection()!
    selection.selectAllChildren(el)
    selection.collapseToEnd()
  })
}

test.describe("value", () => {
  test("renders text and tokens, each token as one chip", async ({ page, open }) => {
    await open("token-input", { value: startValue })
    await expect(editor(page)).toHaveAttribute("aria-multiline", "true")
    await expect(chips(page)).toHaveText(["a.ts ×"])
    await expect(editor(page)).toContainText("Summarize")
    expect(await text(page)).toBe(startValue)
  })

  test("tokens it starts with show their rendered content once, and read as their label and kind", async ({
    page,
    open,
  }) => {
    await open("token-input", { value: "[@a.ts](file:src/a.ts) and [@b.ts](file:src/b.ts)" })
    await expect(hosts(page)).toHaveText(["a.ts × file", "b.ts × file"])
    await expect(hosts(page).first()).toMatchAriaSnapshot("- text: a.ts file")
    await expect(hosts(page).last()).toMatchAriaSnapshot("- text: b.ts file")
    expect(await text(page)).toBe("[@a.ts](file:src/a.ts) and [@b.ts](file:src/b.ts)")
  })

  test("tokens and their remove parts mark a read-only or disabled input", async ({ page, open }) => {
    const remove = page.locator("[data-slot='token-input-token-remove']")
    await open("token-input", { value: startValue, readonly: "" })
    await expect(chips(page)).toHaveAttribute("data-readonly", "")
    await expect(remove).toHaveAttribute("data-readonly", "")
    await expect(remove).not.toHaveAttribute("data-disabled")
    await open("token-input", { value: startValue, disabled: "" })
    await expect(remove).toHaveAttribute("data-disabled", "")
    await expect(remove).not.toHaveAttribute("data-readonly")
  })

  test("is empty with a placeholder until something is typed", async ({ page, open }) => {
    await open("token-input")
    await expect(editor(page)).toHaveAttribute("aria-placeholder", "Ask anything")
    await expect(editor(page)).toHaveAttribute("data-empty", "")
    await editor(page).focus()
    await page.keyboard.type("hi")
    await expect(editor(page)).not.toHaveAttribute("data-empty", "")
    expect(await lastAction(page)).toBe("input-change:hi")
  })

  test("typing after a token goes after it", async ({ page, open }) => {
    await open("token-input", { value: "[@a.ts](file:src/a.ts)" })
    await caretToEnd(page)
    await page.keyboard.type("x")
    expect(await text(page)).toBe("[@a.ts](file:src/a.ts)x")
  })

  test("Shift+Enter starts a new line", async ({ page, open }) => {
    await open("token-input")
    await editor(page).focus()
    await page.keyboard.type("one")
    await page.keyboard.press("Shift+Enter")
    await page.keyboard.type("two")
    expect(await text(page)).toBe("one\ntwo")
  })
})

test.describe("tokens", () => {
  test("@ opens the menu inside the input, and choosing inserts a token and a space", async ({
    page,
    open,
  }) => {
    await open("token-input")
    await editor(page).focus()
    await page.keyboard.type("see @b")
    await expect(listbox(page)).toBeVisible()
    await page.keyboard.press("Enter")
    await expect(chips(page)).toHaveText(["b.ts ×"])
    expect(await text(page)).toBe("see [@b.ts](file:src/b.ts) ")
    await page.keyboard.type("now")
    expect(await text(page)).toBe("see [@b.ts](file:src/b.ts) now")
  })

  test("a controlled input takes tokens from its menu and keeps typing in order", async ({ page, open }) => {
    await open("token-input", { controlled: "" })
    await editor(page).focus()
    await page.keyboard.type("see @b")
    await expect(listbox(page)).toBeVisible()
    await page.keyboard.press("Enter")
    await page.keyboard.type("now")
    await expect(chips(page)).toHaveText(["b.ts ×"])
    expect(await text(page)).toBe("see [@b.ts](file:src/b.ts) now")
    await page.keyboard.press("ControlOrMeta+z")
    expect(await text(page)).toBe("see [@b.ts](file:src/b.ts) ")
  })

  test("Enter in an open menu chooses and doesn't submit", async ({ page, open }) => {
    await open("token-input")
    await editor(page).focus()
    await page.keyboard.type("@a")
    await expect(listbox(page)).toBeVisible()
    await page.keyboard.press("Enter")
    await expect(submitted(page)).toHaveText("")
  })

  test("one Backspace removes a whole token, and says so", async ({ page, open }) => {
    await open("token-input", { value: "x [@a.ts](file:src/a.ts)" })
    await caretToEnd(page)
    await page.keyboard.press("Backspace")
    await expect(chips(page)).toHaveCount(0)
    expect(await text(page)).toBe("x ")
    await expect(announcer(page)).toHaveText(/^Removed file a\.ts\s?$/)
  })

  test("Backspace removes tokens one by one, with no keystroke spent on anchors", async ({ page, open }) => {
    await open("token-input", { value: "[@a.ts](file:src/a.ts)[@b.ts](file:src/b.ts)" })
    await caretToEnd(page)
    await page.keyboard.press("Backspace")
    await expect(chips(page)).toHaveText(["a.ts ×"])
    await page.keyboard.press("Backspace")
    await expect(chips(page)).toHaveCount(0)
  })

  test("Delete removes the token after the caret", async ({ page, open }) => {
    await open("token-input", { value: "[@a.ts](file:src/a.ts)x" })
    await editor(page).focus()
    await editor(page).evaluate((el) => getSelection()!.collapse(el, 0))
    await page.keyboard.press("Delete")
    expect(await text(page)).toBe("x")
  })

  test("the caret crosses a token with one arrow press each way", async ({ page, open }) => {
    await open("token-input", { value: "ab[@a.ts](file:src/a.ts)cd" })
    await caretToEnd(page)
    for (let index = 0; index < 3; index++) await page.keyboard.press("ArrowLeft")
    await page.keyboard.type("|")
    expect(await text(page)).toBe("ab|[@a.ts](file:src/a.ts)cd")
    await page.keyboard.press("ArrowRight")
    await page.keyboard.type("^")
    expect(await text(page)).toBe("ab|[@a.ts](file:src/a.ts)^cd")
  })

  test("the caret can sit between two adjacent tokens", async ({ page, open }) => {
    await open("token-input", { value: "[@a.ts](file:src/a.ts)[@b.ts](file:src/b.ts)" })
    await caretToEnd(page)
    await page.keyboard.press("ArrowLeft")
    await page.keyboard.type("+")
    expect(await text(page)).toBe("[@a.ts](file:src/a.ts)+[@b.ts](file:src/b.ts)")
  })

  test("clicking past a final token and typing lands after it", async ({ page, open }) => {
    await open("token-input", { value: "ab [@a.ts](file:src/a.ts)" })
    const box = (await editor(page).boundingBox())!
    await page.mouse.click(box.x + box.width - 8, box.y + box.height / 2)
    await page.keyboard.type("z")
    expect(await text(page)).toBe("ab [@a.ts](file:src/a.ts)z")
  })

  test("word deletion stops at a token", async ({ page, open }) => {
    await open("token-input", { value: "one [@a.ts](file:src/a.ts)two three" })
    await caretToEnd(page)
    // The platform's shortcut, whatever the engine: WebKit on Linux deletes a word with Control.
    const word = process.platform === "darwin" ? "Alt+Backspace" : "Control+Backspace"
    await page.keyboard.press(word)
    expect(await text(page)).toBe("one [@a.ts](file:src/a.ts)two ")
    await page.keyboard.press(word)
    expect(await text(page)).toBe("one [@a.ts](file:src/a.ts)")
    await page.keyboard.press(word)
    expect(await text(page)).toBe("one ")
  })

  test("the remove button removes its token and keeps focus", async ({ page, open }) => {
    await open("token-input", { value: startValue })
    await editor(page).focus()
    await page.getByText("×").click()
    await expect(chips(page)).toHaveCount(0)
    await expect(editor(page)).toBeFocused()
    expect(await lastAction(page)).toBe("remove-press:Summarize  please")
  })

  test("with tokenDeletion select, the first Backspace selects the token and the second removes it", async ({
    page,
    open,
  }) => {
    await open("token-input", { value: "x [@a.ts](file:src/a.ts)", deletion: "select" })
    await caretToEnd(page)
    await page.keyboard.press("Backspace")
    await expect(chips(page)).toHaveAttribute("data-selected", "")
    await expect(chips(page)).toHaveCount(1)
    await page.keyboard.press("Backspace")
    await expect(chips(page)).toHaveCount(0)
  })

  test("with tokenDeletion revert, Backspace turns the token back into text and the menu opens on it", async ({
    page,
    open,
  }) => {
    await open("token-input", { deletion: "revert" })
    await editor(page).focus()
    await page.keyboard.type("@b")
    await page.keyboard.press("Enter")
    await page.keyboard.press("Backspace")
    await page.keyboard.press("Backspace")
    expect(await text(page)).toBe("@b.ts")
    await expect(listbox(page)).toBeVisible()
  })
})

test.describe("history", () => {
  test("Undo and Redo step through edits, a token insertion on its own", async ({ page, open }) => {
    await open("token-input")
    await editor(page).focus()
    await page.keyboard.type("see ")
    await page.keyboard.type("@b")
    await page.keyboard.press("Enter")
    expect(await text(page)).toBe("see [@b.ts](file:src/b.ts) ")
    await page.keyboard.press("ControlOrMeta+z")
    expect(await text(page)).toBe("see @b")
    expect(await lastAction(page)).toBe("undo:see @b")
    await page.keyboard.press("ControlOrMeta+Shift+z")
    expect(await text(page)).toBe("see [@b.ts](file:src/b.ts) ")
  })

  test("Undo brings back a removed token", async ({ page, open }) => {
    await open("token-input", { value: "x [@a.ts](file:src/a.ts)" })
    await caretToEnd(page)
    await page.keyboard.press("Backspace")
    await page.keyboard.press("ControlOrMeta+z")
    await expect(chips(page)).toHaveText(["a.ts ×"])
  })

  test("a pending token shows loading, then settles without an undo step", async ({ page, open }) => {
    await open("token-input", { pending: "" })
    await editor(page).focus()
    await page.keyboard.type("x @a")
    await page.keyboard.press("Enter")
    await expect(chips(page)).toHaveAttribute("data-pending", "")
    await expect(chips(page)).not.toHaveAttribute("data-pending", "")
    // The token takes what the Promise resolved to.
    await expect(chips(page)).toContainText("Loaded")
    await page.keyboard.press("ControlOrMeta+z")
    await expect(chips(page)).toHaveCount(0)
    await page.keyboard.press("ControlOrMeta+Shift+z")
    await expect(chips(page)).not.toHaveAttribute("data-pending", "")
  })

  test("a pending token whose load fails is removed", async ({ page, open }) => {
    await open("token-input", { pending: "", fail: "" })
    await editor(page).focus()
    await page.keyboard.type("@a")
    await page.keyboard.press("Enter")
    await expect(chips(page)).toHaveCount(1)
    await expect(chips(page)).toHaveCount(0)
  })
})

test.describe("clipboard", () => {
  test("copying tokens into plain text and back keeps them", async ({ page, open }) => {
    await open("token-input", { value: "[@a.ts](file:src/a.ts) and [@b.ts](file:src/b.ts)" })
    await editor(page).focus()
    await page.keyboard.press("ControlOrMeta+a")
    await page.keyboard.press("ControlOrMeta+c")
    const scratch = page.getByRole("textbox", { name: "Scratch" })
    await scratch.focus()
    await page.keyboard.press("ControlOrMeta+v")
    await expect(scratch).toHaveValue("[@a.ts](file:src/a.ts) and [@b.ts](file:src/b.ts)")
    await page.keyboard.press("ControlOrMeta+a")
    await page.keyboard.press("ControlOrMeta+c")
    await caretToEnd(page)
    await page.keyboard.press("ControlOrMeta+a")
    await page.keyboard.press("Backspace")
    await expect(chips(page)).toHaveCount(0)
    await page.keyboard.press("ControlOrMeta+v")
    await expect(chips(page)).toHaveText(["a.ts ×", "b.ts ×"])
    expect(await lastAction(page)).toBe("paste:[@a.ts](file:src/a.ts) and [@b.ts](file:src/b.ts)")
  })

  test("copy writes codec text and HTML with the tokens", async ({ page, open }) => {
    await open("token-input", { value: "hi [@a.ts](file:src/a.ts)" })
    await editor(page).focus()
    await page.keyboard.press("ControlOrMeta+a")
    const data = await editor(page).evaluate((el) => {
      const event = new ClipboardEvent("copy", {
        clipboardData: new DataTransfer(),
        bubbles: true,
        cancelable: true,
      })
      el.dispatchEvent(event)
      return {
        text: event.clipboardData!.getData("text/plain"),
        html: event.clipboardData!.getData("text/html"),
      }
    })
    expect(data.text).toBe("hi [@a.ts](file:src/a.ts)")
    expect(data.html).toContain('data-ui-tokens="hi [@a.ts](file:src/a.ts)"')
  })

  test("pasting codec text makes tokens", async ({ page, open, browserName }) => {
    test.skip(browserName === "firefox", "Firefox ignores the data a synthetic paste event carries.")
    await open("token-input")
    await editor(page).focus()
    await editor(page).evaluate((el) => {
      const transfer = new DataTransfer()
      transfer.setData("text/plain", "use [@b.ts](file:src/b.ts)")
      el.dispatchEvent(
        new ClipboardEvent("paste", { clipboardData: transfer, bubbles: true, cancelable: true }),
      )
    })
    await expect(chips(page)).toHaveText(["b.ts ×"])
    expect(await text(page)).toBe("use [@b.ts](file:src/b.ts)")
  })

  test("with copy label, plain text gets what people read", async ({ page, open }) => {
    await open("token-input", { value: "hi [@a.ts](file:src/a.ts)", copy: "label" })
    await editor(page).focus()
    await page.keyboard.press("ControlOrMeta+a")
    const plain = await editor(page).evaluate((el) => {
      const event = new ClipboardEvent("copy", {
        clipboardData: new DataTransfer(),
        bubbles: true,
        cancelable: true,
      })
      el.dispatchEvent(event)
      return event.clipboardData!.getData("text/plain")
    })
    expect(plain).toBe("hi a.ts")
  })
})

test.describe("submit", () => {
  test("Enter submits the codec text", async ({ page, open }) => {
    await open("token-input", { value: startValue })
    await caretToEnd(page)
    await page.keyboard.press("Enter")
    await expect(submitted(page)).toHaveText(startValue)
  })

  test("with mod+enter, Enter is a new line and Cmd or Ctrl+Enter submits", async ({ page, open }) => {
    await open("token-input", { shortcut: "mod+enter" })
    await editor(page).focus()
    await page.keyboard.type("a")
    await page.keyboard.press("Enter")
    await page.keyboard.type("b")
    await expect(submitted(page)).toHaveText("")
    await page.keyboard.press("ControlOrMeta+Enter")
    await expect(submitted(page)).toHaveText("a\nb")
  })

  test("a form submits the codec text under the input's name", async ({ page, open }) => {
    await open("token-input", { value: startValue, form: "" })
    await page.getByRole("button", { name: "Send" }).click()
    await expect(submitted(page)).toHaveText(startValue)
  })

  test("Enter submits the form the input's form attribute names, not the one it's in", async ({
    page,
    open,
  }) => {
    await open("token-input", { value: startValue, "other-form": "" })
    await editor(page).focus()
    await page.keyboard.press("Enter")
    await expect(submitted(page)).toHaveText(`other:${startValue}`)
  })

  test("Enter while an input method composes doesn't submit", async ({ page, open, browserName }) => {
    test.skip(browserName !== "chromium", "Only Chromium can drive an input method.")
    await open("token-input")
    await editor(page).focus()
    const session = await page.context().newCDPSession(page)
    await session.send("Input.imeSetComposition", { text: "に", selectionStart: 1, selectionEnd: 1 })
    await page.keyboard.press("Enter")
    await session.send("Input.insertText", { text: "日本" })
    await expect(editor(page)).toContainText("日本")
    await expect(submitted(page)).toHaveText("")
  })
})
