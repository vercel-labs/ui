import type { Page } from "@playwright/test"
import { expect, lastAction, test } from "../fixtures"

// A search field over an always-open list, like a command palette. It follows
// the WAI-ARIA APG combobox pattern with an inline listbox
// https://www.w3.org/WAI/ARIA/apg/patterns/combobox/ : focus stays in the
// field, aria-activedescendant points at the highlighted option, and the
// highlight follows typing, so Enter runs the best match.

const input = (page: Page) =>
  page.getByRole("combobox", { name: "Search commands" })
const listbox = (page: Page) => page.getByRole("listbox")
const option = (page: Page, name: string) =>
  page.getByRole("option", { name, exact: true })
const options = (page: Page) => listbox(page).getByRole("option")
const highlightedOption = (page: Page) =>
  listbox(page).locator("[data-highlighted]")

// The highlighted option's text, as aria-activedescendant names it.
async function highlighted(page: Page) {
  const id = await input(page).getAttribute("aria-activedescendant")
  if (!id) {
    return null
  }
  return page.evaluate((id) => {
    const el = document.getElementById(id)
    if (!el) {
      return null
    }
    // The shortcut's keys aren't part of the name.
    return [...el.childNodes]
      .filter((node) => node.nodeType === Node.TEXT_NODE)
      .map((node) => node.textContent)
      .join("")
      .trim()
  }, id)
}

test.describe("field", () => {
  test.beforeEach(async ({ open }) => {
    await open("command")
  })

  test("is a combobox that controls an always-expanded listbox", async ({
    page,
  }) => {
    await expect(input(page)).toHaveAttribute("aria-expanded", "true")
    const id = await listbox(page).getAttribute("id")
    await expect(input(page)).toHaveAttribute("aria-controls", id!)
    await expect(listbox(page)).toBeVisible()
  })

  test("the first command is highlighted from the start", async ({ page }) => {
    await expect.poll(() => highlighted(page)).toBe("Calendar")
    await expect(option(page, "Calendar")).toHaveAttribute(
      "data-highlighted",
      ""
    )
  })
})

test.describe("filtering", () => {
  test.beforeEach(async ({ open }) => {
    await open("command")
  })

  test("typing keeps the commands that match, ignoring case and accents", async ({
    page,
  }) => {
    await input(page).fill("CALÉ")
    await expect(options(page)).toHaveText(["Calendar"], { useInnerText: true })
  })

  test("groups without a match hide, and the rest keep their labels", async ({
    page,
  }) => {
    await input(page).fill("bill")
    await expect(page.getByRole("group", { name: "Settings" })).toBeVisible()
    await expect(page.getByRole("group", { name: "Suggestions" })).toBeHidden()
  })

  test("the first match is highlighted as the text changes, so Enter runs it", async ({
    page,
  }) => {
    await input(page).fill("prof")
    await expect.poll(() => highlighted(page)).toBe("Profile")
    await page.keyboard.press("Enter")
    await expect.poll(() => lastAction(page)).toBe("action:profile")
  })

  test("deleting text brings back the commands the shorter text matches", async ({
    page,
  }) => {
    await input(page).fill("cale")
    await expect(options(page)).toHaveText(["Calendar"], { useInnerText: true })
    await input(page).press("Backspace")
    await input(page).press("Backspace")
    await expect(option(page, "Calculator")).toBeVisible()
  })

  test("commands without a value that mount while the field has text show when they match", async ({
    page,
    open,
  }) => {
    await open("command", { unvalued: "" })
    await input(page).fill("change")
    await expect(option(page, "Change theme…")).toBeVisible()
    await page.keyboard.press("Enter")
    await expect(option(page, "Light")).toBeVisible()
    // Going back restores the text, and the first page's commands mount again.
    await input(page).press("Backspace")
    await expect(input(page)).toHaveValue("change")
    await expect(option(page, "Change theme…")).toBeVisible()
    await expect(page.getByRole("group", { name: "Settings" })).toBeVisible()
  })

  test("going back a page reports the new highlight as back, not as a removal", async ({
    page,
  }) => {
    await input(page).fill("change")
    await page.keyboard.press("Enter")
    await expect(option(page, "Light")).toBeVisible()
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("ArrowDown")
    await expect(
      page.getByRole("status", { name: "Last highlight" })
    ).toHaveText("system:list-navigation")
    await input(page).press("Backspace")
    await expect(option(page, "Change theme…")).toBeVisible()
    await expect(
      page.getByRole("status", { name: "Last highlight" })
    ).toHaveText("theme:back")
  })

  test("nothing matching shows the empty message", async ({ page }) => {
    await input(page).fill("zzzz")
    await expect(page.getByText("No results found.")).toBeVisible()
    await expect(options(page)).toHaveCount(0)
  })
})

test.describe("keyboard", () => {
  test.beforeEach(async ({ open }) => {
    await open("command")
  })

  test("arrow keys move the highlight while focus stays in the field", async ({
    page,
  }) => {
    await input(page).focus()
    await page.keyboard.press("ArrowDown")
    await expect.poll(() => highlighted(page)).toBe("Search Emoji")
    await page.keyboard.press("ArrowUp")
    await expect.poll(() => highlighted(page)).toBe("Calendar")
    await expect(input(page)).toBeFocused()
  })

  test("Home and End stay in the field for the caret", async ({
    page,
    open,
  }) => {
    await open("command")
    await input(page).fill("bill")
    await page.keyboard.press("Home")
    await page.keyboard.press("End")
    await expect(highlightedOption(page)).toHaveText(/Billing/)
  })

  test("the highlighted option has the id aria-activedescendant names", async ({
    page,
  }) => {
    await input(page).focus()
    await page.keyboard.press("ArrowDown")
    const id = await option(page, "Search Emoji").getAttribute("id")
    await expect(input(page)).toHaveAttribute("aria-activedescendant", id!)
  })

  test("Enter runs the highlighted command", async ({ page }) => {
    await input(page).focus()
    await page.keyboard.press("ArrowDown")
    await expect.poll(() => highlighted(page)).toBe("Search Emoji")
    await page.keyboard.press("Enter")
    await expect.poll(() => lastAction(page)).toBe("action:emoji")
  })
})

test.describe("pointer", () => {
  test.beforeEach(async ({ open }) => {
    await open("command")
  })

  test("clicking a command runs it", async ({ page }) => {
    await option(page, "Billing").click()
    await expect.poll(() => lastAction(page)).toBe("action:billing")
  })

  test("a disabled command doesn't run", async ({ page }) => {
    await option(page, "Calculator").click({ force: true })
    await expect(option(page, "Calculator")).toHaveAttribute(
      "aria-disabled",
      "true"
    )
    expect(await lastAction(page)).toBe("")
  })
})

test.describe("autoHighlight", () => {
  test("without autoHighlight, nothing is highlighted until an arrow key", async ({
    page,
    open,
  }) => {
    await open("command", { noauto: "" })
    await input(page).fill("set")
    await expect(highlightedOption(page)).toHaveCount(0)
    await page.keyboard.press("ArrowDown")
    await expect(highlightedOption(page)).toHaveCount(1)
  })
})
