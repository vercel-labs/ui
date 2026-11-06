import { expect } from "@playwright/test"
import { test } from "../docs-test"
import { openExamples } from "./behaviors/helpers"

const url = "/docs/behaviors/text"

test("every example renders without errors", async ({ page }) => {
  const { errors } = await openExamples(page, url)
  await expect(page.locator("[data-example]")).toHaveCount(8)
  expect(errors).toEqual([])
})

test("find an item by typing: one letter steps, quick letters jump, arrows move one", async ({ page }) => {
  await openExamples(page, url)
  const list = page.getByRole("listbox", { name: "Fruit" })
  const selected = list.getByRole("option", { selected: true })
  await list.focus()
  await page.keyboard.press("p")
  await expect(selected).toHaveText("Peach")
  await page.keyboard.press("p")
  await expect(selected).toHaveText("Pear")
  await page.waitForTimeout(600)
  await page.keyboard.type("pl")
  await expect(selected).toHaveText("Plum")
  await page.keyboard.press("ArrowDown")
  await expect(selected).toHaveText("Quince")
  const id = await selected.getAttribute("id")
  await expect(list).toHaveAttribute("aria-activedescendant", id!)
})

test("what an item is called: typing skips shortcut hints and finds an icon by its label", async ({
  page,
}) => {
  await openExamples(page, url)
  const list = page.getByRole("listbox", { name: "Edit" })
  const selected = list.getByRole("option", { selected: true })
  await list.focus()
  await page.keyboard.press("c")
  await expect(selected).toHaveAccessibleName(/^Cut/)
  await page.keyboard.press("c")
  await expect(selected).toHaveAccessibleName(/^Copy/)
  await page.waitForTimeout(600)
  await page.keyboard.press("d")
  await expect(selected).toHaveAccessibleName("Delete")
})

test("names with spaces: space joins a search, picks without one, and the delay can grow", async ({
  page,
}) => {
  await page.clock.install()
  await openExamples(page, url)
  const list = page.getByRole("listbox", { name: "City" })
  const selected = list.getByRole("option", { selected: true })
  const picked = page.locator("[data-picked-city]")
  await list.focus()
  await page.keyboard.type("new y")
  await expect(selected).toHaveAccessibleName("New York")
  await expect(picked).toHaveText("Nothing picked yet")
  await page.clock.runFor(600)
  await page.keyboard.press(" ")
  await expect(picked).toHaveText("Picked New York")
  await page.keyboard.type("nap")
  await page.keyboard.press("Escape")
  await page.keyboard.press("Enter")
  await expect(picked).toHaveText("Picked Naples")
  await page.getByRole("checkbox", { name: "Wait 1.5 seconds between keys" }).check()
  await list.focus()
  await page.keyboard.press("n")
  await page.clock.runFor(1000)
  await page.keyboard.press("i")
  await expect(selected).toHaveAccessibleName("Nice")
})

test("rank what someone searches for: the best match comes first, accents and all", async ({ page }) => {
  await openExamples(page, url)
  const example = page
    .locator("[data-example]")
    .filter({ has: page.locator("[data-slot='command-search-root']") })
  const search = example.first().getByRole("searchbox", { name: "Search commands" })
  const items = example.first().getByRole("listitem")
  await search.fill("gp")
  await expect(items.first()).toContainText("Git push")
  await expect(items).toHaveCount(2)
  await search.fill("set")
  await expect(items.first()).toContainText("Settings")
  await expect(items.first()).toContainText("0.93")
  await search.fill("resu")
  await expect(items).toHaveCount(1)
  await expect(items.first()).toContainText("Résumé template")
})

test("highlight what matched: each mode marks its own ranges in the text as written", async ({ page }) => {
  await openExamples(page, url)
  const mode = page.getByRole("combobox", { name: "Match" })
  const example = page.locator("[data-example]").filter({ has: mode })
  const search = example.getByRole("searchbox", { name: "Search commands" })
  const marks = example.locator("mark")
  await search.fill("gp")
  await expect(marks).toHaveText(["G", "p", "G", "p"])
  await mode.selectOption("contains")
  await expect(example.getByRole("listitem")).toHaveCount(0)
  await search.fill("set")
  await expect(marks).toHaveText(["set", "Set"])
  await mode.selectOption("startsWith")
  await expect(example.getByRole("listitem")).toHaveText(["Settings"])
  await search.fill("resu")
  await expect(marks).toHaveText(["Résu"])
})

test("the page's language: the price and the names follow the lang around them", async ({ page }) => {
  await openExamples(page, url)
  const language = page.getByRole("combobox", { name: "Language" })
  await expect(page.locator("[data-price]")).toHaveText("€1,234.50")
  await expect(page.locator("[data-names]")).toHaveText("Anna, Åsa, Örjan, and Zoë")
  await expect(page.locator("[data-language]")).toContainText("Page: en-US")
  await language.selectOption("sv-SE")
  await expect(page.locator("[data-price]")).toHaveText("1 234,50 €")
  await expect(page.locator("[data-names]")).toHaveText("Anna, Zoë, Åsa och Örjan")
  await expect(page.locator("[data-language]")).toContainText("Page: sv-SE")
})

test("tags from elsewhere: a POSIX tag is repaired, and something else falls back", async ({ page }) => {
  await openExamples(page, url)
  const tag = page.getByRole("textbox", { name: "Language tag" })
  await expect(page.locator("[data-locale]")).toHaveText("Intl reads en-US")
  await expect(page.locator("[data-date]")).toHaveText("October 21, 2026")
  await tag.fill("de_DE.UTF-8")
  await expect(page.locator("[data-locale]")).toHaveText("Intl reads de-DE")
  await expect(page.locator("[data-date]")).toHaveText("21. Oktober 2026")
  await tag.fill("zz-123-!")
  await expect(page.locator("[data-locale]")).toHaveText("Not a language tag")
})

test("search as you type: results wait for the input method to commit, unless the waiting is off", async ({
  page,
}) => {
  await openExamples(page, "/docs/behaviors/text")
  const field = page.getByRole("searchbox", { name: "Filter" })
  const results = page.getByRole("status").filter({ hasText: /Results for|Type to see results/ })
  await field.scrollIntoViewIfNeeded()
  // A step of a composition: the field's value changes, with an input event marked composing.
  const compose = (value: string, type = "input") =>
    field.evaluate(
      (el, { value, type }) => {
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(el, value)
        el.dispatchEvent(
          type === "input"
            ? new InputEvent("input", { bubbles: true, isComposing: true, data: value })
            : new CompositionEvent("compositionend", { bubbles: true, data: value }),
        )
      },
      { value, type },
    )
  await compose("にh")
  await compose("にほn")
  await expect(results).toHaveText("Type to see results")
  await compose("日本", "compositionend")
  await expect(results).toHaveText("Results for “日本”")
  await page.getByRole("checkbox", { name: "Wait for the input method" }).uncheck()
  await compose("日本ご")
  await expect(results).toHaveText("Results for “日本ご”")
  await field.fill("tokyo")
  await expect(results).toHaveText("Results for “tokyo”")
})
