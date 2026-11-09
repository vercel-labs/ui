import type { Page } from "@playwright/test"
import { expect, lastAction, test } from "../fixtures"

// Behavior past the WAI-ARIA pattern, tagged `@enhancement`.

const input = (page: Page) =>
  page.getByRole("combobox", { name: "Search commands" })
const listbox = (page: Page) => page.getByRole("listbox")
const option = (page: Page, name: string) =>
  page.getByRole("option", { name, exact: true })
const options = (page: Page) => listbox(page).getByRole("option")
const highlightedOption = (page: Page) =>
  listbox(page).locator("[data-highlighted]")

test.describe("enhancements", { tag: "@enhancement" }, () => {
  test("the highlighted command is the selected option, as the APG's list autocomplete marks it", async ({
    page,
    open,
  }) => {
    await open("command")
    await expect(option(page, "Calendar")).toHaveAttribute(
      "aria-selected",
      "true"
    )
    await input(page).focus()
    await page.keyboard.press("ArrowDown")
    await expect(option(page, "Search Emoji")).toHaveAttribute(
      "aria-selected",
      "true"
    )
    await expect(option(page, "Calendar")).toHaveAttribute(
      "aria-selected",
      "false"
    )
  })

  test("keywords match as well as labels", async ({ page, open }) => {
    await open("command")
    await input(page).fill("smiley")
    await expect(options(page)).toHaveText(["Search Emoji"], {
      useInnerText: true,
    })
  })

  test("fuzzy matching finds the letters in order, across words", async ({
    page,
    open,
  }) => {
    await open("command")
    await input(page).fill("sem")
    await expect(options(page)).toHaveText(["Search Emoji"], {
      useInnerText: true,
    })
  })

  test("arrow keys skip disabled commands", async ({ page, open }) => {
    await open("command")
    await input(page).focus()
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("ArrowDown")
    await expect(highlightedOption(page)).toHaveText(/Profile/)
  })

  test("a command's shortcut runs it and sets aria-keyshortcuts", async ({
    page,
    open,
  }) => {
    await open("command")
    await expect(option(page, "Billing")).toHaveAttribute(
      "aria-keyshortcuts",
      /^(Meta|Control)\+B$/
    )
    await input(page).focus()
    await page.keyboard.press("ControlOrMeta+b")
    await expect.poll(() => lastAction(page)).toBe("action:billing")
  })

  test("a shortcut runs its command while the search hides it", async ({
    page,
    open,
  }) => {
    await open("command")
    await input(page).fill("cal")
    await page.keyboard.press("ControlOrMeta+s")
    await expect.poll(() => lastAction(page)).toBe("action:settings")
  })

  test("a command is pending while its action's Promise runs, and runs only once", async ({
    page,
    open,
  }) => {
    await open("command", { slow: "" })
    const billing = option(page, "Billing")
    await billing.click()
    await expect(billing).toHaveAttribute("data-pending", "")
    await expect(billing).toHaveAttribute("aria-busy", "true")
    await expect(billing).toHaveAttribute("aria-disabled", "true")
    await expect(billing).not.toHaveAttribute("data-pending", "")
    await expect(billing).not.toHaveAttribute("aria-disabled", "true")
  })

  test("a command opens its page, and Backspace in the empty field goes back with the text", async ({
    page,
    open,
  }) => {
    await open("command")
    await input(page).fill("them")
    await page.keyboard.press("Enter")
    await expect(options(page)).toHaveText(["Light", "Dark", "System"], {
      useInnerText: true,
    })
    await expect(input(page)).toHaveValue("")
    await expect(highlightedOption(page)).toHaveText("Light")
    await page.keyboard.press("Backspace")
    await expect(input(page)).toHaveValue("them")
    await expect(highlightedOption(page)).toHaveText("Change theme…")
  })

  test("Escape clears the text, then goes back a page", async ({
    page,
    open,
  }) => {
    await open("command", { pages: "theme" })
    await input(page).fill("da")
    await page.keyboard.press("Escape")
    await expect(input(page)).toHaveValue("")
    await expect(options(page)).toHaveCount(3)
    await page.keyboard.press("Escape")
    await expect(option(page, "Calendar")).toBeVisible()
  })

  test("results that still hold the highlighted command keep the highlight", async ({
    page,
    open,
  }) => {
    await open("command", { value: "billing" })
    await expect(highlightedOption(page)).toHaveText(/Billing/)
    await input(page).focus()
    await page.keyboard.press("ArrowDown")
    await expect(highlightedOption(page)).toHaveText("Change theme…")
  })

  test("the list is busy while results load", async ({ page, open }) => {
    await open("command", { loading: "" })
    await expect(listbox(page)).toHaveAttribute("aria-busy", "true")
    await expect(page.getByText("Loading…")).toBeVisible()
  })
})
