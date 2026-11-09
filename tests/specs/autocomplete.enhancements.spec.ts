import type { Page } from "@playwright/test"
import { expect, lastAction, test } from "../fixtures"
import { scrollIn, scrolledIntoView } from "../fixtures/popup"

// Behavior past the WAI-ARIA pattern, tagged `@enhancement`.

const input = (page: Page) => page.getByRole("combobox", { name: "Fruit" })
const listbox = (page: Page) => page.getByRole("listbox")
const options = (page: Page) => listbox(page).getByRole("option")
const selection = (page: Page) =>
  input(page).evaluate((el: HTMLInputElement) => [
    el.selectionStart,
    el.selectionEnd,
  ])

test.describe("enhancements", { tag: "@enhancement" }, () => {
  test("inline completion fills in the first match with the rest selected after the caret", async ({
    page,
    open,
  }) => {
    await open("autocomplete", { inline: "" })
    await input(page).pressSequentially("bla")
    await expect(input(page)).toHaveValue("blackberry")
    expect(await selection(page)).toEqual([3, 10])
    await expect(input(page)).toHaveAttribute("aria-autocomplete", "both")
    await expect(
      page.getByRole("option", { name: "Blackberry" })
    ).toHaveAttribute("data-highlighted", "")
  })

  test("Backspace takes an inline completion out and doesn't complete again", async ({
    page,
    open,
  }) => {
    await open("autocomplete", { inline: "" })
    await input(page).pressSequentially("ban")
    await expect(input(page)).toHaveValue("banana")
    await page.keyboard.press("Backspace")
    await expect(input(page)).toHaveValue("ban")
  })

  test("ArrowRight accepts an inline completion", async ({ page, open }) => {
    await open("autocomplete", { inline: "" })
    await input(page).pressSequentially("man")
    await page.keyboard.press("ArrowRight")
    await expect(input(page)).toHaveValue("mango")
    expect(await selection(page)).toEqual([5, 5])
    // Accepted, it's what was typed, so Escape keeps it.
    await page.keyboard.press("Escape")
    await expect(input(page)).toHaveValue("mango")
  })

  test("with inline completion, arrow keys fill in the suggestion they highlight", async ({
    page,
    open,
  }) => {
    await open("autocomplete", { inline: "" })
    await input(page).pressSequentially("bl")
    await page.keyboard.press("ArrowDown")
    await expect(input(page)).toHaveValue("Blueberry")
    await expect(options(page)).toHaveCount(2)
  })

  test("the suggestions open when the field gets focus", async ({
    page,
    open,
  }) => {
    await open("autocomplete", { focus: "" })
    await input(page).focus()
    // The content is the listbox until the list inside it binds, a moment
    // after it opens, so wait for one before checking it's shown.
    await expect(listbox(page)).toHaveCount(1)
    await expect(listbox(page)).toBeVisible()
    await expect(options(page)).toHaveCount(10)
  })

  test("Enter with nothing highlighted runs onSubmit with the text", async ({
    page,
    open,
  }) => {
    await open("autocomplete")
    await input(page).fill("kiwi")
    await page.keyboard.press("Enter")
    await expect.poll(() => lastAction(page)).toBe("submit:kiwi")
  })

  test("filtering matches a suggestion's keywords", async ({ page, open }) => {
    await open("autocomplete")
    await input(page).fill("bilb")
    await expect(options(page)).toHaveText(["Blueberry"], {
      useInnerText: true,
    })
  })

  test("a form reset puts the default text back", async ({ page, open }) => {
    await open("autocomplete", { value: "Grape" })
    await expect(input(page)).toHaveValue("Grape")
    await input(page).fill("Kiwi")
    await page.getByRole("button", { name: "Reset" }).click()
    await expect(input(page)).toHaveValue("Grape")
  })

  test("the list is named by the field's label", async ({ page, open }) => {
    await open("autocomplete")
    await input(page).fill("a")
    await expect(page.getByRole("listbox", { name: "Fruit" })).toBeVisible()
  })

  test("an immediate search runs once when the autocomplete mounts", async ({
    page,
    open,
  }) => {
    await open("autocomplete", { async: "" })
    await page.getByRole("button", { name: "Show fruits" }).click()
    await expect(page.getByRole("option", { name: "Grape" })).toBeVisible()
    const searches = await page.evaluate(
      () =>
        (
          window as unknown as {
            fruitSearches?: { query: string; aborted: boolean }[]
          }
        ).fruitSearches
    )
    expect(searches).toEqual([{ query: "", aborted: false }])
  })

  test("a newer search aborts the older one, and only its results land", async ({
    page,
    open,
  }) => {
    await open("autocomplete", { async: "" })
    const searches = () =>
      page.evaluate(
        () =>
          (
            window as unknown as {
              fruitSearches?: { query: string; aborted: boolean }[]
            }
          ).fruitSearches
      )
    await input(page).focus()
    await page.keyboard.type("a")
    // The list is busy from the key press, but the search only starts once
    // typing pauses, so wait for it to be on its way before typing "p".
    await expect
      .poll(
        async () => (await searches())?.some(({ query }) => query === "a"),
        { intervals: [20] }
      )
      .toBe(true)
    await page.keyboard.type("p")
    await expect(options(page)).toHaveText(["Apple", "Apricot", "Grape"], {
      useInnerText: true,
    })
    expect(
      (await searches())?.find(({ query }) => query === "a")?.aborted
    ).toBe(true)
  })

  for (const part of ["content", "list"] as const) {
    test(`arrow keys keep the highlighted item in view when the ${part} scrolls`, async ({
      page,
      open,
    }) => {
      await open("autocomplete")
      await input(page).focus()
      await page.keyboard.press("ArrowDown")
      await expect(listbox(page)).toBeVisible()
      await scrollIn(listbox(page), part)
      const last = listbox(page).getByRole("option", {
        name: "Mango",
        exact: true,
      })
      for (
        let i = 0;
        i < 12 && (await last.getAttribute("data-highlighted")) === null;
        i++
      ) {
        await page.keyboard.press("ArrowDown")
      }
      await expect(last).toHaveAttribute("data-highlighted", "")
      expect(await scrolledIntoView(last)).toBe(true)
    })
  }
})
