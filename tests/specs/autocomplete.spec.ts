import type { Page } from "@playwright/test"
import { expect, lastAction, test, waitForStill } from "../fixtures"

// A text field with suggestions, following the WAI-ARIA APG combobox pattern
// with list autocomplete https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
// The text is the value: suggestions only fill it in.

const input = (page: Page) => page.getByRole("combobox", { name: "Fruit" })
const listbox = (page: Page) => page.getByRole("listbox")
const option = (page: Page, name: string) =>
  page.getByRole("option", { name, exact: true })
const options = (page: Page) => listbox(page).getByRole("option")
const submitted = (page: Page) =>
  page.getByRole("status", { name: "Submitted" })

async function highlighted(page: Page) {
  const id = await input(page).getAttribute("aria-activedescendant")
  if (!id) {
    return null
  }
  return page.evaluate(
    (id) => document.getElementById(id)?.textContent?.trim(),
    id
  )
}

test.describe("field", () => {
  test.beforeEach(async ({ open }) => {
    await open("autocomplete")
  })

  test("is a combobox named by its label, with list autocomplete", async ({
    page,
  }) => {
    await expect(input(page)).toHaveAttribute("aria-autocomplete", "list")
    await expect(input(page)).toHaveAttribute("aria-expanded", "false")
  })

  test("typing opens the suggestions that match, and the text stays what was typed", async ({
    page,
  }) => {
    await input(page).fill("bl")
    await expect(options(page)).toHaveText(["Blackberry", "Blueberry"], {
      useInnerText: true,
    })
    await expect(input(page)).toHaveValue("bl")
    await expect(input(page)).toHaveAttribute("aria-expanded", "true")
  })

  test("text that matches nothing stays, with the empty message", async ({
    page,
  }) => {
    await input(page).fill("kiwi")
    await expect(page.getByText("No fruits found")).toBeVisible()
    await expect(input(page)).toHaveValue("kiwi")
  })

  test("typing in the middle of the text keeps the caret where it was", async ({
    page,
  }) => {
    await input(page).fill("aple")
    await input(page).evaluate((el: HTMLInputElement) =>
      el.setSelectionRange(1, 1)
    )
    await page.keyboard.type("p")
    await expect(input(page)).toHaveValue("apple")
    await expect
      .poll(() =>
        input(page).evaluate((el: HTMLInputElement) => el.selectionStart)
      )
      .toBe(2)
  })
})

test.describe("choosing", () => {
  test.beforeEach(async ({ open }) => {
    await open("autocomplete")
  })

  test("arrow keys move the highlight while focus stays in the field", async ({
    page,
  }) => {
    await input(page).fill("a")
    await page.keyboard.press("ArrowDown")
    await expect.poll(() => highlighted(page)).toBe("Apple")
    await page.keyboard.press("ArrowDown")
    await expect.poll(() => highlighted(page)).toBe("Apricot")
    await expect(input(page)).toBeFocused()
    await expect(input(page)).toHaveValue("a")
  })

  test("Enter fills in the highlighted suggestion and closes, without submitting", async ({
    page,
  }) => {
    await input(page).fill("blu")
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("Enter")
    await expect(input(page)).toHaveValue("Blueberry")
    await expect(listbox(page)).toBeHidden()
    await expect(input(page)).toBeFocused()
    await expect(submitted(page)).toHaveText("")
  })

  test("clicking a suggestion fills it in and keeps focus in the field", async ({
    page,
  }) => {
    await input(page).fill("man")
    await option(page, "Mango").click()
    await expect(input(page)).toHaveValue("Mango")
    await expect(input(page)).toBeFocused()
    await expect(listbox(page)).toBeHidden()
  })

  test("a disabled suggestion can't be chosen", async ({ page }) => {
    await input(page).fill("che")
    // A forced press doesn't wait for a rising sheet.
    await waitForStill(listbox(page))
    await option(page, "Cherry").click({ force: true })
    await expect(input(page)).toHaveValue("che")
  })

  test("Escape takes an inline completion back out", async ({ page, open }) => {
    await open("autocomplete", { inline: "" })
    await input(page).pressSequentially("lem")
    await page.keyboard.press("Escape")
    await expect(input(page)).toHaveValue("lem")
  })

  test("Escape closes the suggestions and keeps the text", async ({ page }) => {
    await input(page).fill("ap")
    await expect(listbox(page)).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(listbox(page)).toBeHidden()
    await expect(input(page)).toHaveValue("ap")
  })
})

test.describe("forms", () => {
  test("Enter with nothing highlighted submits the text as typed", async ({
    page,
    open,
  }) => {
    await open("autocomplete")
    await input(page).fill("kiwi")
    await page.keyboard.press("Enter")
    await expect(submitted(page)).toHaveText("fruit=kiwi")
  })

  test("the field submits a chosen suggestion's text under its name", async ({
    page,
    open,
  }) => {
    await open("autocomplete")
    await input(page).fill("lem")
    await option(page, "Lemon").click()
    await page.getByRole("button", { name: "Submit" }).click()
    await expect(submitted(page)).toHaveText("fruit=Lemon")
  })

  test("required blocks submitting an empty field", async ({ page, open }) => {
    await open("autocomplete", { required: "" })
    await page.getByRole("button", { name: "Submit" }).click()
    await expect(submitted(page)).toHaveText("")
    expect(
      await input(page).evaluate(
        (el: HTMLInputElement) => el.validity.valueMissing
      )
    ).toBe(true)
  })

  test("a disabled field can't be focused or changed", async ({
    page,
    open,
  }) => {
    await open("autocomplete", { disabled: "" })
    await expect(input(page)).toBeDisabled()
  })
})

test.describe("clear", () => {
  test("the clear button empties the field and keeps focus in it", async ({
    page,
    open,
  }) => {
    await open("autocomplete", { value: "Apple" })
    await page.getByRole("button", { name: "Clear" }).click()
    await expect(input(page)).toHaveValue("")
    await expect(input(page)).toBeFocused()
    await expect.poll(() => lastAction(page)).toMatch(/^value::/)
  })
})
