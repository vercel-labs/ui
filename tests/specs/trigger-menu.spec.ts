import type { Page } from "@playwright/test"
import { expect, lastAction, test } from "../fixtures"

// Suggestions opened by a trigger in a text field. Focus stays in the field,
// arrows move a virtual highlight, and choosing replaces the trigger and its
// query.

const field = (page: Page) => page.getByRole("textbox", { name: "Message" })
const listbox = (page: Page) => page.getByRole("listbox", { name: "Message" })
const options = (page: Page) => listbox(page).getByRole("option")
const option = (page: Page, name: string) =>
  page.getByRole("option", { name, exact: true })
const openStatus = (page: Page) => page.getByRole("status", { name: "Open" })

async function highlighted(page: Page) {
  return page.locator('[role="option"][data-highlighted]').textContent()
}

test.describe("opening", () => {
  test.beforeEach(async ({ open }) => {
    await open("trigger-menu")
  })

  test("typing a trigger opens the list with every item", async ({ page }) => {
    await field(page).focus()
    await page.keyboard.type("hi @")
    await expect(listbox(page)).toBeVisible()
    await expect(options(page)).toHaveText(
      [
        "Alice Smith",
        "Bob Jones",
        "Carol White",
        "Dan Brown",
        "José García",
        "山田太郎",
      ],
      { useInnerText: true }
    )
    await expect(openStatus(page)).toHaveText("true:input-change")
  })

  test("typing after the trigger filters the list", async ({ page }) => {
    await field(page).focus()
    await page.keyboard.type("@car")
    await expect(options(page)).toHaveText(["Carol White"], {
      useInnerText: true,
    })
  })

  test("queries match Unicode letters and ignore accents", async ({ page }) => {
    await field(page).focus()
    await page.keyboard.type("@jose")
    await expect(options(page)).toHaveText(["José García"], {
      useInnerText: true,
    })
    await field(page).fill("")
    await page.keyboard.type("@山")
    await expect(options(page)).toHaveText(["山田太郎"], { useInnerText: true })
  })

  test("a trigger mid-word doesn't open", async ({ page }) => {
    await field(page).focus()
    await page.keyboard.type("mail@a")
    await expect(listbox(page)).toBeHidden()
  })

  test("a trigger followed by a space doesn't open", async ({ page }) => {
    await field(page).focus()
    await page.keyboard.type("@ a")
    await expect(listbox(page)).toBeHidden()
  })

  test("a command trigger opens only at the start, so a leading space escapes it", async ({
    page,
  }) => {
    await field(page).focus()
    await page.keyboard.type(" /m")
    await expect(listbox(page)).toBeHidden()
    await field(page).fill("")
    await page.keyboard.type("/m")
    await expect(options(page)).toHaveText(["model"], { useInnerText: true })
  })

  test("the list opens at the trigger and stays there as the query grows", async ({
    page,
  }) => {
    await field(page).focus()
    await page.keyboard.type("hi @")
    await expect(listbox(page)).toBeVisible()
    const before = await listbox(page).boundingBox()
    await page.keyboard.type("al")
    const after = await listbox(page).boundingBox()
    expect(after!.x).toBeCloseTo(before!.x, 0)
    const fieldBox = await field(page).boundingBox()
    expect(before!.x).toBeGreaterThan(fieldBox!.x + 10)
  })

  test("pasting a trigger opens the list", async ({ page }) => {
    await field(page).focus()
    await page.keyboard.insertText("hi @al")
    await expect(options(page)).toHaveText(["Alice Smith"], {
      useInnerText: true,
    })
  })

  test("focusing a field that already has a match doesn't open the list", async ({
    page,
  }) => {
    await field(page).fill("hi @al")
    await page.getByRole("button", { name: "After" }).focus()
    await field(page).focus()
    await expect(listbox(page)).toBeHidden()
  })

  test("moving the caret into a match doesn't open the list", async ({
    page,
  }) => {
    await field(page).focus()
    await page.keyboard.type("@al and more")
    await expect(listbox(page)).toBeHidden()
    for (let index = 0; index < 9; index++) {
      await page.keyboard.press("ArrowLeft")
    }
    await expect(listbox(page)).toBeHidden()
  })

  test("a query that matches nothing closes the list, and Backspace that matches again opens it", async ({
    page,
  }) => {
    await field(page).focus()
    await page.keyboard.type("@alicex")
    await expect(listbox(page)).toBeHidden()
    await page.keyboard.press("Backspace")
    await expect(options(page)).toHaveText(["Alice Smith"], {
      useInnerText: true,
    })
  })

  test("with an empty part, a query that matches nothing keeps the list open with the message", async ({
    page,
    open,
  }) => {
    await open("trigger-menu", { empty: "" })
    await field(page).focus()
    await page.keyboard.type("@zz")
    await expect(page.getByText("No matches")).toBeVisible()
  })
})

test.describe("choosing", () => {
  test.beforeEach(async ({ open }) => {
    await open("trigger-menu")
  })

  test("the first match is highlighted, and Enter inserts it with a space", async ({
    page,
  }) => {
    await field(page).focus()
    await page.keyboard.type("hi @car")
    await expect(listbox(page)).toBeVisible()
    expect(await highlighted(page)).toBe("Carol White")
    await page.keyboard.press("Enter")
    await expect(field(page)).toHaveValue("hi @Carol White ")
    await expect(listbox(page)).toBeHidden()
    expect(await lastAction(page)).toBe("select:carol:")
  })

  test("Tab accepts the highlighted suggestion and focus stays in the field", async ({
    page,
  }) => {
    await field(page).focus()
    await page.keyboard.type("@bo")
    await expect(listbox(page)).toBeVisible()
    await page.keyboard.press("Tab")
    await expect(field(page)).toHaveValue("@Bob Jones ")
    await expect(field(page)).toBeFocused()
  })

  test("arrow keys move the highlight, and wrap", async ({ page }) => {
    await field(page).focus()
    await page.keyboard.type("@")
    await expect(listbox(page)).toBeVisible()
    await page.keyboard.press("ArrowDown")
    expect(await highlighted(page)).toBe("Bob Jones")
    await page.keyboard.press("ArrowUp")
    await page.keyboard.press("ArrowUp")
    expect(await highlighted(page)).toBe("山田太郎")
  })

  test("a disabled item can be highlighted but not chosen", async ({
    page,
  }) => {
    await field(page).focus()
    await page.keyboard.type("@dan")
    await expect(listbox(page)).toBeVisible()
    await page.keyboard.press("Enter")
    await expect(field(page)).toHaveValue("@dan")
  })

  test("clicking an item inserts it and keeps focus and the caret in the field", async ({
    page,
  }) => {
    await field(page).focus()
    await page.keyboard.type("hi @")
    await option(page, "Bob Jones").click()
    await expect(field(page)).toHaveValue("hi @Bob Jones ")
    await expect(field(page)).toBeFocused()
    await page.keyboard.type("x")
    await expect(field(page)).toHaveValue("hi @Bob Jones x")
  })

  test("text after the caret stays where it was", async ({ page }) => {
    await field(page).fill("hi  there")
    // Home doesn't move the caret on a Mac in every engine, so the caret is placed directly.
    await field(page).evaluate((el: HTMLTextAreaElement) =>
      el.setSelectionRange(3, 3)
    )
    await page.keyboard.type("@al")
    await expect(listbox(page)).toBeVisible()
    await page.keyboard.press("Enter")
    await expect(field(page)).toHaveValue("hi @Alice Smith  there")
  })
})

test.describe("dismissing", () => {
  test.beforeEach(async ({ open }) => {
    await open("trigger-menu")
  })

  test("Escape closes the list, keeps the text and focus", async ({ page }) => {
    await field(page).focus()
    await page.keyboard.type("@al")
    await expect(listbox(page)).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(listbox(page)).toBeHidden()
    await expect(field(page)).toHaveValue("@al")
    await expect(field(page)).toBeFocused()
    await expect(openStatus(page)).toHaveText("false:escape-key")
  })

  test("a dismissed match stays closed through caret moves, typing in it and clicks", async ({
    page,
  }) => {
    await field(page).focus()
    await page.keyboard.type("@al")
    await expect(listbox(page)).toBeVisible()
    await page.keyboard.press("Escape")
    await page.keyboard.press("ArrowLeft")
    await page.keyboard.press("ArrowRight")
    await page.keyboard.type("ice")
    await page.getByRole("button", { name: "After" }).click()
    await field(page).click()
    await page.keyboard.press("End")
    await page.keyboard.press("Backspace")
    await expect(listbox(page)).toBeHidden()
  })

  test("a new trigger after a dismissed one opens", async ({ page }) => {
    await field(page).focus()
    await page.keyboard.type("@al")
    await expect(listbox(page)).toBeVisible()
    await page.keyboard.press("Escape")
    await page.keyboard.type(" @bo")
    await expect(options(page)).toHaveText(["Bob Jones"], {
      useInnerText: true,
    })
  })

  test("deleting and retyping the trigger opens it again", async ({ page }) => {
    await field(page).focus()
    await page.keyboard.type("@")
    await expect(listbox(page)).toBeVisible()
    await page.keyboard.press("Escape")
    await page.keyboard.press("Backspace")
    await page.keyboard.type("@")
    await expect(listbox(page)).toBeVisible()
  })

  test("Ctrl+Space reopens a dismissed match", async ({ page }) => {
    await field(page).focus()
    await page.keyboard.type("@al")
    await expect(listbox(page)).toBeVisible()
    await page.keyboard.press("Escape")
    await page.keyboard.press("Control+Space")
    await expect(options(page)).toHaveText(["Alice Smith"], {
      useInnerText: true,
    })
    await expect(openStatus(page)).toHaveText("true:shortcut")
  })

  test("moving the caret out of the match closes the list", async ({
    page,
  }) => {
    await field(page).focus()
    await page.keyboard.type("hi @al")
    await expect(listbox(page)).toBeVisible()
    for (let index = 0; index < 3; index++) {
      await page.keyboard.press("ArrowLeft")
    }
    await expect(listbox(page)).toBeHidden()
    await expect(openStatus(page)).toHaveText("false:caret-move")
  })

  test("pressing outside closes the list", async ({ page }) => {
    await field(page).focus()
    await page.keyboard.type("@al")
    await expect(listbox(page)).toBeVisible()
    await page.mouse.click(600, 400)
    await expect(listbox(page)).toBeHidden()
  })
})

test.describe("arguments", () => {
  test.beforeEach(async ({ open }) => {
    await open("trigger-menu")
  })

  test("a command with arguments asks for each one, and Enter finishes with them", async ({
    page,
  }) => {
    await field(page).focus()
    await page.keyboard.type("/mo")
    await expect(listbox(page)).toBeVisible()
    await page.keyboard.press("Enter")
    await expect(field(page)).toHaveValue("/model ")
    await expect(options(page)).toHaveText(["opus", "sonnet", "haiku"], {
      useInnerText: true,
    })
    await expect(page.locator(".hint")).toHaveText("<model> <effort>")
    await page.keyboard.press("Tab")
    await expect(field(page)).toHaveValue("/model opus ")
    await expect(options(page)).toHaveText(["low", "medium", "high"], {
      useInnerText: true,
    })
    await page.keyboard.type("hi")
    await page.keyboard.press("Enter")
    await expect(field(page)).toHaveValue("/model opus high ")
    expect(await lastAction(page)).toBe("select:model:model=opus,effort=high")
    await expect(listbox(page)).toBeHidden()
  })

  test("Enter finishes once only optional arguments are left", async ({
    page,
  }) => {
    await field(page).focus()
    await page.keyboard.type("/model")
    await page.keyboard.press("Enter")
    await page.keyboard.type("son")
    await page.keyboard.press("Enter")
    expect(await lastAction(page)).toBe("select:model:model=sonnet")
  })

  test("a free-text argument shows no list, and Enter takes the typed text", async ({
    page,
  }) => {
    await field(page).focus()
    await page.keyboard.type("/sea")
    await page.keyboard.press("Enter")
    await expect(field(page)).toHaveValue("/search ")
    await expect(listbox(page)).toBeHidden()
    await expect(page.locator(".hint")).toHaveText("<query>")
    await page.keyboard.type("weather in Paris")
    await page.keyboard.press("Enter")
    expect(await lastAction(page)).toBe("select:search:query=weather in Paris")
  })

  test("Backspace past an argument's start goes back a level", async ({
    page,
  }) => {
    await field(page).focus()
    await page.keyboard.type("/model")
    await page.keyboard.press("Enter")
    await page.keyboard.press("Tab")
    await expect(field(page)).toHaveValue("/model opus ")
    await page.keyboard.press("Backspace")
    await expect(options(page)).toHaveText(["opus"], { useInnerText: true })
    for (let index = 0; index < 5; index++) {
      await page.keyboard.press("Backspace")
    }
    await expect(options(page)).toHaveText(["model"], { useInnerText: true })
  })

  test("Escape in an argument keeps the inserted text", async ({ page }) => {
    await field(page).focus()
    await page.keyboard.type("/model")
    await page.keyboard.press("Enter")
    await expect(listbox(page)).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(field(page)).toHaveValue("/model ")
    await expect(listbox(page)).toBeHidden()
    await page.keyboard.type("x")
    await expect(listbox(page)).toBeHidden()
  })

  test("an item that submits sends the form once inserted", async ({
    page,
  }) => {
    await field(page).focus()
    await page.keyboard.type("/sen")
    await page.keyboard.press("Enter")
    await expect(page.getByRole("status", { name: "Submitted" })).toHaveText(
      "/send "
    )
  })
})

test.describe("loading", () => {
  test.beforeEach(async ({ open }) => {
    await open("trigger-menu")
  })

  test("items load for the query", async ({ page }) => {
    await field(page).focus()
    await page.keyboard.type("#de")
    await expect(options(page)).toHaveText(["design"], { useInnerText: true })
  })

  test("a newer query aborts the older load, and only its results land", async ({
    page,
    open,
  }) => {
    await open("trigger-menu", { slow: "" })
    await field(page).focus()
    await page.keyboard.type("#e")
    // Entering the channel level can load the empty query first, so wait for the load of "e" itself.
    await page.waitForFunction(() =>
      (
        window as unknown as { channelRequests?: { query: string }[] }
      ).channelRequests?.some((request) => request.query === "e")
    )
    await page.keyboard.type("x")
    await page.keyboard.press("Backspace")
    await page.keyboard.press("Backspace")
    await page.keyboard.type("d")
    await expect(options(page)).toHaveText(["design"], { useInnerText: true })
    const requests = await page.evaluate(
      () =>
        (
          window as unknown as {
            channelRequests: { query: string; aborted: boolean }[]
          }
        ).channelRequests
    )
    expect(requests.find((request) => request.query === "e")).toEqual({
      query: "e",
      aborted: true,
    })
    expect(requests.at(-1)).toEqual({ query: "d", aborted: false })
  })
})

test.describe("undo", () => {
  test("Undo after choosing brings the query back, never a dead undo", async ({
    page,
    open,
    browserName,
  }) => {
    await open("trigger-menu")
    await field(page).focus()
    await page.keyboard.type("hi @al")
    await expect(listbox(page)).toBeVisible()
    await page.keyboard.press("Enter")
    await expect(field(page)).toHaveValue("hi @Alice Smith ")
    await page.keyboard.press("ControlOrMeta+z")
    // WebKit merges the insertion into the typing before it.
    const expected = browserName === "webkit" ? /^(hi @al|)$/ : /^hi @al$/
    await expect(field(page)).toHaveValue(expected)
  })
})

test.describe("input", () => {
  test("the SDK's Textarea works as the field, and undo still works", async ({
    page,
    open,
    browserName,
  }) => {
    await open("trigger-menu", { textarea: "" })
    await field(page).focus()
    await page.keyboard.type("hi @al")
    await expect(listbox(page)).toBeVisible()
    await page.keyboard.press("Enter")
    await expect(field(page)).toHaveValue("hi @Alice Smith ")
    await page.keyboard.press("ControlOrMeta+z")
    await expect(field(page)).toHaveValue(
      browserName === "webkit" ? /^(hi @al|)$/ : /^hi @al$/
    )
  })

  test("an <input> field works the same", async ({ page, open }) => {
    await open("trigger-menu", { input: "" })
    const input = page.getByRole("combobox", { name: "Message" })
    await input.focus()
    await page.keyboard.type("@bo")
    await expect(options(page)).toHaveText(["Bob Jones"], {
      useInnerText: true,
    })
    await page.keyboard.press("Enter")
    await expect(input).toHaveValue("@Bob Jones ")
  })
})
