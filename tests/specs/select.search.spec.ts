import AxeBuilder from "@axe-core/playwright"
import type { Page } from "@playwright/test"
import { expect, lastAction, test } from "../fixtures"

// A searchable select: a search field inside the list filters it, as the
// APG's select-only combobox does with a search box. The trigger stays the
// select's button, holding one value, and focus stays in the field while the
// arrow keys move a highlight it points at with aria-activedescendant.

const trigger = (page: Page) => page.getByRole("combobox", { name: "Fruit" })
const search = (page: Page) =>
  page.getByRole("combobox", { name: "Search fruits" })
const listbox = (page: Page) => page.getByRole("listbox")
const option = (page: Page, name: string) =>
  page.getByRole("option", { name, exact: true })

// The options shown, by their text.
async function optionTexts(page: Page) {
  return listbox(page).getByRole("option").allInnerTexts()
}

async function openSearch(page: Page) {
  await trigger(page).focus()
  await page.keyboard.press("Enter")
  await expect(search(page)).toBeFocused()
}

test.describe("searchable select", { tag: "@enhancement" }, () => {
  test.beforeEach(async ({ open }) => {
    await open("select", { search: "" })
  })

  test("opening focuses the search field and highlights the selected item", async ({
    page,
    open,
  }) => {
    await open("select", { search: "", value: "cherry" })
    await openSearch(page)
    const id = await option(page, "Cherry").getAttribute("id")
    await expect(search(page)).toHaveAttribute("aria-activedescendant", id!)
    await expect(option(page, "Cherry")).toHaveAttribute("data-highlighted", "")
  })

  test("the search field is a combobox that controls the listbox in the list", async ({
    page,
  }) => {
    await openSearch(page)
    const id = await listbox(page).getAttribute("id")
    await expect(search(page)).toHaveAttribute("aria-controls", id!)
    await expect(search(page)).toHaveAttribute("aria-expanded", "true")
    await expect(search(page)).toHaveAttribute("aria-autocomplete", "list")
  })

  test("typing filters the list and highlights the first match", async ({
    page,
  }) => {
    await openSearch(page)
    await page.keyboard.type("an")
    await expect
      .poll(() => optionTexts(page))
      .toEqual(["Banana", "Mango", "Orange"])
    const id = await option(page, "Banana").getAttribute("id")
    await expect(search(page)).toHaveAttribute("aria-activedescendant", id!)
  })

  test("typing never jumps by first letter: the characters go into the field", async ({
    page,
  }) => {
    await openSearch(page)
    await page.keyboard.type("b n")
    await expect(search(page)).toHaveValue("b n")
    await expect(search(page)).toBeFocused()
  })

  test("arrow keys move the highlight while focus stays in the field", async ({
    page,
  }) => {
    await openSearch(page)
    await page.keyboard.press("ArrowDown")
    await expect(option(page, "Banana")).toHaveAttribute("data-highlighted", "")
    await expect(search(page)).toBeFocused()
    await page.keyboard.press("ArrowUp")
    await expect(option(page, "Apple")).toHaveAttribute("data-highlighted", "")
  })

  test("Home and End are the field's, so the highlight stays", async ({
    page,
  }) => {
    await openSearch(page)
    await page.keyboard.type("an")
    await expect(option(page, "Banana")).toHaveAttribute("data-highlighted", "")
    // What Home does to the caret is the platform's: macOS engines scroll instead.
    await page.keyboard.press("End")
    await page.keyboard.press("Home")
    await expect(option(page, "Banana")).toHaveAttribute("data-highlighted", "")
    await expect(search(page)).toBeFocused()
  })

  test("Enter chooses the highlighted item, closes, and focus returns to the trigger", async ({
    page,
  }) => {
    await openSearch(page)
    await page.keyboard.type("man")
    await page.keyboard.press("Enter")
    await expect(listbox(page)).toBeHidden()
    await expect(trigger(page)).toBeFocused()
    await expect(trigger(page)).toContainText("Mango")
    expect(await lastAction(page)).toBe("value:mango")
  })

  test("a click on an item chooses it", async ({ page }) => {
    await openSearch(page)
    await page.keyboard.type("ch")
    await option(page, "Cherry").click()
    await expect(trigger(page)).toContainText("Cherry")
  })

  test("Escape closes the list and focus returns to the trigger", async ({
    page,
  }) => {
    await openSearch(page)
    await page.keyboard.type("ap")
    await page.keyboard.press("Escape")
    await expect(listbox(page)).toBeHidden()
    await expect(trigger(page)).toBeFocused()
  })

  test("the search empties once the list closes", async ({ page }) => {
    await openSearch(page)
    await page.keyboard.type("ap")
    await page.keyboard.press("Escape")
    await expect(listbox(page)).toBeHidden()
    await openSearch(page)
    await expect(search(page)).toHaveValue("")
    await expect.poll(() => optionTexts(page)).toHaveLength(8)
  })

  test("an empty message shows when nothing matches", async ({ page }) => {
    await openSearch(page)
    await page.keyboard.type("zz")
    await expect(page.getByText("No fruits found")).toBeVisible()
    await expect(listbox(page).getByRole("option")).toHaveCount(0)
  })

  test("matches ignore case and accents", async ({ page }) => {
    await openSearch(page)
    await page.keyboard.type("BÁN")
    await expect.poll(() => optionTexts(page)).toEqual(["Banana"])
  })

  test("labels mark what the search matched", async ({ page }) => {
    await openSearch(page)
    await page.keyboard.type("err")
    await expect(option(page, "Blueberry").locator("mark")).toHaveText("err")
    await expect(option(page, "Cherry").locator("mark")).toHaveText("err")
  })

  test("with multiple, choosing keeps the list open and focus in the field", async ({
    page,
    open,
  }) => {
    await open("select", { search: "", multiple: "" })
    await openSearch(page)
    await page.keyboard.type("an")
    await page.keyboard.press("Enter")
    await option(page, "Mango").click()
    await expect(search(page)).toBeFocused()
    expect(await lastAction(page)).toBe("value:banana,mango")
  })

  test("Tab closes the list and moves on from the trigger", async ({
    page,
    tab,
  }) => {
    await openSearch(page)
    await tab()
    await expect(listbox(page)).toBeHidden()
    await expect(trigger(page)).not.toBeFocused()
  })

  test("no axe violations while searching", async ({ page }) => {
    await openSearch(page)
    await page.keyboard.type("an")
    await expect.poll(() => optionTexts(page)).toHaveLength(3)
    const results = await new AxeBuilder({ page })
      .disableRules(["region", "landmark-one-main", "page-has-heading-one"])
      .analyze()
    expect(results.violations).toEqual([])
  })
})

test.describe(
  "items shown while the search is empty",
  { tag: "@enhancement" },
  () => {
    test("recent items show until the user types, then the results", async ({
      page,
      open,
    }) => {
      await open("select", { search: "", recent: "" })
      await openSearch(page)
      await expect(page.getByRole("group", { name: "Recent" })).toBeVisible()
      await expect.poll(() => optionTexts(page)).toEqual(["Mango", "Lemon"])
      await page.keyboard.type("an")
      await expect
        .poll(() => optionTexts(page))
        .toEqual(["Banana", "Mango", "Orange"])
    })

    test("a recent item is chosen like any other, and its label shows in the trigger", async ({
      page,
      open,
    }) => {
      await open("select", { search: "", recent: "" })
      await openSearch(page)
      await option(page, "Lemon").click()
      await expect(trigger(page)).toContainText("Lemon")
    })
  }
)

test.describe("searchable select", () => {
  test("typing on the closed trigger still selects by first letter", async ({
    page,
    open,
  }) => {
    await open("select", { search: "" })
    await trigger(page).focus()
    await page.keyboard.press("o")
    await expect(trigger(page)).toContainText("Orange")
    await expect(listbox(page)).toBeHidden()
  })
})
