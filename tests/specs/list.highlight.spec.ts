import type { Locator, Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// Match highlighting: an item text part marks what the typed text matched, in
// <mark>, the way the list filters: accents and case ignored as the user's
// language ignores them, a contiguous match for "contains", and each letter
// in order for "fuzzy". Searchable Select has its own in select.search.spec.ts.

const option = (page: Page, name: string) =>
  page.getByRole("option", { name, exact: true })

// The marked parts of an option, in order.
const marks = (item: Locator) => item.locator("mark").allInnerTexts()

test.describe("combobox", { tag: "@enhancement" }, () => {
  const input = (page: Page) => page.getByRole("combobox", { name: "Country" })

  test.beforeEach(async ({ open }) => {
    await open("combobox", { highlight: "" })
  })

  test("marks the part of each label the text matched", async ({ page }) => {
    await input(page).fill("an")
    await expect.poll(() => marks(option(page, "France"))).toEqual(["an"])
    await expect.poll(() => marks(option(page, "Germany"))).toEqual(["an"])
  })

  test("marks keep the label's own case and accents while matching without them", async ({
    page,
  }) => {
    await input(page).fill("ÁUS")
    await expect.poll(() => marks(option(page, "Australia"))).toEqual(["Aus"])
    await expect.poll(() => marks(option(page, "Austria"))).toEqual(["Aus"])
  })

  test("an item matched by a keyword has nothing to mark", async ({ page }) => {
    await input(page).fill("deutsch")
    await expect(option(page, "Germany")).toBeVisible()
    await expect(option(page, "Germany").locator("mark")).toHaveCount(0)
  })

  test("marks go away when the text is cleared, and the label reads whole", async ({
    page,
  }) => {
    await input(page).fill("an")
    await expect(option(page, "France").locator("mark")).toHaveCount(1)
    await input(page).fill("")
    await expect(option(page, "France").locator("mark")).toHaveCount(0)
    await expect(option(page, "France")).toHaveText(/^France/)
  })
})

test.describe("autocomplete", { tag: "@enhancement" }, () => {
  test("marks the part of each suggestion the text matched", async ({
    page,
    open,
  }) => {
    await open("autocomplete", { highlight: "" })
    await page.getByRole("combobox", { name: "Fruit" }).fill("berr")
    await expect.poll(() => marks(option(page, "Blackberry"))).toEqual(["berr"])
    await expect.poll(() => marks(option(page, "Blueberry"))).toEqual(["berr"])
  })
})

test.describe("command", { tag: "@enhancement" }, () => {
  const search = (page: Page) =>
    page.getByRole("combobox", { name: "Search commands" })

  test("marks each letter a fuzzy match found, joining neighbours", async ({
    page,
    open,
  }) => {
    await open("command", { highlight: "" })
    await search(page).fill("prfl")
    await expect
      .poll(() => marks(option(page, "Profile")))
      .toEqual(["Pr", "f", "l"])
  })

  test("marks a whole match at a word start", async ({ page, open }) => {
    await open("command", { highlight: "" })
    await search(page).fill("emo")
    await expect
      .poll(() => marks(option(page, "Search Emoji")))
      .toEqual(["Emo"])
  })
})

test.describe("highlighting", () => {
  const input = (page: Page) => page.getByRole("combobox", { name: "Country" })

  test("the chosen label in the input shows every item unmarked", async ({
    page,
    open,
  }) => {
    await open("combobox", { highlight: "" })
    await input(page).fill("chi")
    await option(page, "Chile").click()
    await expect(page.getByRole("listbox")).toBeHidden()
    await input(page).click()
    await expect(page.getByRole("listbox")).toBeVisible()
    await expect(page.getByRole("listbox").locator("mark")).toHaveCount(0)
  })
})
