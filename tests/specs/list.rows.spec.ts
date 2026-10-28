import type { Page } from "@playwright/test"
import { expect, lastAction, test } from "../fixtures"

// Rows people rebuild around a list: suggestions while nothing is typed,
// "select all" for a whole list or one group, chips that collapse into
// "+N more", a value text that counts the rest, and the next page loading
// when the end of the list is reached.

const option = (page: Page, name: string) => page.getByRole("option", { name, exact: true })
const listbox = (page: Page) => page.getByRole("listbox")
const optionTexts = (page: Page) => listbox(page).getByRole("option").allInnerTexts()

test.describe("items shown while nothing is typed", { tag: "@enhancement" }, () => {
  test("a combobox shows its recent items, as a group, until the user types", async ({ page, open }) => {
    await open("combobox", { recent: "" })
    const input = page.getByRole("combobox", { name: "Country" })
    await input.click()
    await expect(page.getByRole("group", { name: "Recent" })).toBeVisible()
    await expect.poll(() => optionTexts(page)).toEqual(["France", "Chile"])
    await input.pressSequentially("au")
    await expect.poll(() => optionTexts(page)).toEqual(["Australia", "Austria"])
    await input.fill("")
    await expect.poll(() => optionTexts(page)).toEqual(["France", "Chile"])
  })

  test("an autocomplete shows recent searches while the field is empty", async ({ page, open }) => {
    await open("autocomplete", { recent: "", focus: "" })
    await page.getByRole("combobox", { name: "Fruit" }).focus()
    await expect(page.getByRole("group", { name: "Recent searches" })).toBeVisible()
    await expect.poll(() => optionTexts(page)).toEqual(["Lemon", "Mango"])
  })
})

test.describe("select all", { tag: "@enhancement" }, () => {
  const selectAll = (page: Page, name = "Select all") => option(page, name)

  test("selects every item that can be chosen, then clears them, and says which with aria-checked", async ({
    page,
    open,
  }) => {
    await open("combobox", { multiple: "", "select-all": "" })
    await page.getByRole("combobox", { name: "Country" }).click()
    await expect(selectAll(page)).toHaveAttribute("aria-checked", "false")
    await selectAll(page).click()
    expect(await lastAction(page)).toBe("value:ar,au,at,be,br,ca,cl,fr,de")
    await expect(selectAll(page)).toHaveAttribute("aria-checked", "true")
    await expect(selectAll(page)).toHaveAttribute("data-checked", "")
    await selectAll(page).click()
    expect(await lastAction(page)).toBe("value:")
  })

  test("is mixed while some are selected", async ({ page, open }) => {
    await open("combobox", { multiple: "", "select-all": "", value: "fr" })
    await page.getByRole("combobox", { name: "Country" }).click()
    await expect(selectAll(page)).toHaveAttribute("aria-checked", "mixed")
    await expect(selectAll(page)).toHaveAttribute("data-indeterminate", "")
  })

  test("covers only the items the text matches", async ({ page, open }) => {
    await open("combobox", { multiple: "", "select-all": "" })
    await page.getByRole("combobox", { name: "Country" }).pressSequentially("au")
    await expect.poll(() => optionTexts(page)).toEqual(["Select all", "Australia", "Austria"])
    await selectAll(page).click()
    expect(await lastAction(page)).toBe("value:au,at")
  })

  test("is reached with the arrow keys and chosen with Enter", async ({ page, open }) => {
    await open("combobox", { multiple: "", "select-all": "" })
    const input = page.getByRole("combobox", { name: "Country" })
    await input.focus()
    await page.keyboard.press("ArrowDown")
    const id = await selectAll(page).getAttribute("id")
    await expect(input).toHaveAttribute("aria-activedescendant", id!)
    await page.keyboard.press("Enter")
    await expect(selectAll(page)).toHaveAttribute("aria-checked", "true")
  })

  test("in a group, it covers that group", async ({ page, open, framework }) => {
    test.skip(framework.includes("data"), "Data groups render no select-all option; the composed ones do.")
    await open("combobox", { multiple: "", "select-all": "", grouped: "" })
    await page.getByRole("combobox", { name: "Country" }).click()
    await option(page, "Select all Europe").click()
    expect(await lastAction(page)).toBe("value:at,fr,de")
    await expect(option(page, "Select all Americas")).toHaveAttribute("aria-checked", "false")
  })

  test("a select's works the same, with real focus", async ({ page, open }) => {
    await open("select", { multiple: "", "select-all": "", value: "apple" })
    await page.getByRole("combobox", { name: "Fruit" }).focus()
    await page.keyboard.press("Enter")
    await expect(option(page, "Apple")).toBeFocused()
    await page.keyboard.press("ArrowUp")
    await expect(selectAll(page)).toBeFocused()
    await expect(selectAll(page)).toHaveAttribute("aria-checked", "mixed")
    await page.keyboard.press("Enter")
    expect(await lastAction(page)).toBe("value:apple,banana,blueberry,cherry,lemon,mango,orange")
  })
})

test.describe("chips that collapse", { tag: "@enhancement" }, () => {
  // A chip is seen through its remove button, which hides with it.
  const chip = (page: Page, name: string) => page.getByRole("button", { name: `Remove ${name}` })

  test("chips past the line hide, and a count says how many", async ({ page, open }) => {
    await open("combobox", { multiple: "", overflow: "", value: "ar,au,at,be,br,ca" })
    await expect(page.getByText(/^\+\d more$/)).toBeVisible()
    const hidden = Number((await page.getByText(/^\+\d more$/).innerText()).match(/\d/)![0])
    expect(hidden).toBeGreaterThan(0)
    await expect(chip(page, "Argentina")).toBeVisible()
    await expect(chip(page, "Canada")).toBeHidden()
    // Every visible chip and the count sit on one line inside the chips.
    const box = (await page.getByRole("toolbar").boundingBox())!
    const count = (await page.getByText(/^\+\d more$/).boundingBox())!
    expect(count.x + count.width).toBeLessThanOrEqual(box.x + box.width)
  })

  test("removing chips brings the hidden ones back, and the count goes", async ({ page, open }) => {
    await open("combobox", { multiple: "", overflow: "", value: "ar,au,at,be" })
    await expect(page.getByText(/^\+\d more$/)).toBeVisible()
    const input = page.getByRole("combobox", { name: "Country" })
    await input.focus()
    for (let step = 0; step < 3; step++) await page.keyboard.press("Backspace")
    await expect(chip(page, "Argentina")).toBeVisible()
    await expect(page.getByText(/^\+\d more$/)).toBeHidden()
  })

  test("a value text lists two labels and counts the rest, in the page's language", async ({
    page,
    open,
    framework,
  }) => {
    test.skip(framework.startsWith("web"), "Web components render chips, not a value text.")
    await open("combobox", { multiple: "", summary: "2", value: "fr,cl,de,at" })
    await expect(page.getByRole("status", { name: "Summary" })).toHaveText("France, Chile, and 2 more")
  })

  test("a select's value lists two labels and counts the rest", async ({ page, open }) => {
    await open("select", { multiple: "", max: "2", value: "apple,banana,cherry,lemon" })
    await expect(page.getByRole("combobox", { name: "Fruit" })).toContainText("Apple, Banana, and 2 more")
  })

  test("a web select value takes moreLabel as a property", async ({ page, open, framework }) => {
    test.skip(!framework.startsWith("web"), "React and Vue pass moreLabel as a prop.")
    await open("select", { multiple: "", max: "2", value: "apple,banana,cherry,lemon" })
    await page
      .locator("ui-select-value")
      .evaluate(
        (el: HTMLElement & { moreLabel?: unknown }) => (el.moreLabel = (count: number) => `${count} others`),
      )
    await expect(page.getByRole("combobox", { name: "Fruit" })).toContainText("Apple, Banana, and 2 others")
  })
})

test.describe("loading more", { tag: "@enhancement" }, () => {
  const input = (page: Page) => page.getByRole("combobox", { name: "Country" })

  test("reaching the last item with the keyboard loads the next page", async ({ page, open }) => {
    await open("combobox", { pages: "" })
    await input(page).focus()
    await page.keyboard.press("ArrowDown")
    await expect(listbox(page).getByRole("option")).toHaveCount(4)
    await page.keyboard.press("ArrowUp")
    await expect(listbox(page).getByRole("option")).toHaveCount(8)
    await expect(
      option(page, "Belgium"),
      "the highlight stays where it was while the page arrives",
    ).toHaveAttribute("data-highlighted", "")
  })

  test("scrolling to the end loads the next page, with a status while it does", async ({ page, open }) => {
    await open("combobox", { pages: "" })
    await input(page).click()
    await expect(listbox(page).getByRole("option")).toHaveCount(4)
    await option(page, "Argentina").hover()
    await page.mouse.wheel(0, 400)
    await expect(page.getByText("Loading more…")).toBeVisible()
    await expect(listbox(page).getByRole("option")).toHaveCount(8)
  })

  test("the last page loads no more", async ({ page, open }) => {
    await open("combobox", { pages: "" })
    await input(page).pressSequentially("r")
    await expect.poll(() => optionTexts(page)).toEqual(["Argentina", "Australia", "Austria", "Brazil"])
    await page.keyboard.press("ArrowUp")
    await expect(listbox(page).getByRole("option")).toHaveCount(7)
    for (let step = 0; step < 3; step++) await page.keyboard.press("ArrowDown")
    await expect(option(page, "Germany")).toHaveAttribute("data-highlighted", "")
    await expect(page.getByText("Loading more…")).toBeHidden()
    await expect(listbox(page).getByRole("option")).toHaveCount(7)
  })
})

test.describe("rows", () => {
  test("a recent item is chosen like any other", async ({ page, open }) => {
    await open("combobox", { recent: "" })
    await page.getByRole("combobox", { name: "Country" }).click()
    await option(page, "Chile").click()
    await expect(page.getByRole("combobox", { name: "Country" })).toHaveValue("Chile")
    expect(await lastAction(page)).toBe("value:cl")
  })

  test("typing on a select never lands on it", async ({ page, open }) => {
    await open("select", { multiple: "", "select-all": "" })
    await page.getByRole("combobox", { name: "Fruit" }).focus()
    await page.keyboard.press("Enter")
    await expect(option(page, "Apple")).toBeFocused()
    await page.keyboard.press("s")
    await expect(option(page, "Apple")).toBeFocused()
  })
})
