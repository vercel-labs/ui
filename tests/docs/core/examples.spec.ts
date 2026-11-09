import { expect, type Locator } from "@playwright/test"
import { test } from "../docs-test"
import { openExamples } from "./behaviors/helpers"

// The newest line in an example's console.
const lastLog = (example: Locator) =>
  example
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()

test("every example on the Core pages, and on Trees and Dates, renders without errors", async ({
  page,
}) => {
  test.setTimeout(90_000)
  for (const [slug, count] of [
    ["core/compose-behaviors", 5],
    ["core/behaviors/trees", 6],
    ["core/date", 8],
  ] as const) {
    const { errors } = await openExamples(page, `/docs/${slug}`)
    await expect(page.locator("[data-example]")).toHaveCount(count)
    expect(errors).toEqual([])
  }
})

test("rating: all four arrows select and wrap, with one tab stop", async ({
  page,
}) => {
  await openExamples(page, "/docs/core/compose-behaviors")
  const example = page.locator("[data-example]").last()
  const group = example.getByRole("radiogroup", { name: "Rating" })
  await group.scrollIntoViewIfNeeded()
  await expect(group.locator('[tabindex="0"]')).toHaveCount(1)
  await group.getByRole("radio", { name: "5 stars" }).click()
  await expect(example.locator("[data-value]")).toHaveText("5")
  for (const [key, value] of [
    ["ArrowLeft", 4],
    ["ArrowUp", 3],
    ["ArrowDown", 4],
    ["End", 5],
    ["ArrowRight", 1],
    ["ArrowUp", 5],
    ["ArrowDown", 1],
    ["ArrowLeft", 5],
    ["Home", 1],
  ] as const) {
    await page.keyboard.press(key)
    const selected = group.getByRole("radio", {
      name: `${value} ${value === 1 ? "star" : "stars"}`,
    })
    await expect(selected).toBeFocused()
    await expect(selected).toHaveAttribute("aria-checked", "true")
    await expect(selected).toHaveAttribute("tabindex", "0")
    await expect(group.locator('[tabindex="0"]')).toHaveCount(1)
    await expect(example.locator("[data-value]")).toHaveText(String(value))
  }
})

test("tree checkboxes: a folder checks its files, shows mixed, and the strategy shapes the value", async ({
  page,
}) => {
  await openExamples(page, "/docs/core/behaviors/trees")
  // The fifth example on Trees.
  const example = page.locator("[data-example]").nth(4)
  const src = example.getByRole("checkbox", { name: "src", exact: true })
  await src.scrollIntoViewIfNeeded()
  await example.getByRole("checkbox", { name: "index.ts" }).click()
  await expect(src).toHaveAttribute("aria-checked", "mixed")
  await expect(lastLog(example)).toHaveText("Value: src/index.ts")
  await example.getByRole("checkbox", { name: "util.ts" }).click()
  await expect(src).toHaveAttribute("aria-checked", "true")
  await expect(lastLog(example)).toHaveText("Value: src/index.ts, src/util.ts")
  await example.getByRole("radio", { name: "trunk" }).click()
  await src.click()
  await src.click()
  await expect(lastLog(example)).toHaveText("Value: src")
})

test("month grid: arrows move by days and weeks, turn the month, and the locale moves the week start", async ({
  page,
}) => {
  await openExamples(page, "/docs/core/date")
  const grid = page.getByRole("grid", { name: "October 2026" })
  await grid.scrollIntoViewIfNeeded()
  const selected = grid.getByRole("gridcell", { selected: true })
  await expect(selected).toHaveText("16")
  await expect(grid.getByRole("columnheader").first()).toHaveText("Sun")
  await selected.focus()
  await page.keyboard.press("ArrowUp")
  await page.keyboard.press("ArrowUp")
  await page.keyboard.press("ArrowUp")
  await expect(page.getByRole("grid", { name: "September 2026" })).toBeVisible()
  await expect(page.locator(":focus")).toHaveAttribute(
    "aria-label",
    /September 25, 2026/
  )
  await page.keyboard.press("Enter")
  await expect(page.getByRole("gridcell", { selected: true })).toHaveAttribute(
    "aria-label",
    /September 25/
  )
  // The month grid is the first example on Dates with a locale to pick.
  await page
    .getByRole("combobox", { name: "Locale" })
    .first()
    .selectOption("de-DE")
  await expect(
    page
      .getByRole("grid", { name: "September 2026" })
      .getByRole("columnheader")
      .first()
  ).toHaveText("Mo")
})
