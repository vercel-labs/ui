import { expect } from "@playwright/test"
import { test } from "../docs-test"
import { openExamples } from "./behaviors/helpers"

test("the introduction's examples render without errors", async ({ page }) => {
  const { errors } = await openExamples(page, "/docs/core")
  await expect(page.locator("[data-example]")).toHaveCount(1)
  expect(errors).toEqual([])
})

test("icon picker: opens in a popover, search, then arrows and Enter pick an icon", async ({
  page,
}) => {
  await openExamples(page, "/docs/core")
  const example = page.locator('[data-example="core/icon-picker"]')
  const trigger = example.getByRole("button", { name: "Pick an Icon" })
  await trigger.click()
  const search = page.getByRole("searchbox", { name: "Search icons" })
  await expect(search).toBeFocused()
  const grid = page.getByRole("group", { name: "Icons" })
  const preview = page.locator('[data-slot="icon-picker-preview"]')
  await expect(grid.locator('[tabindex="0"]')).toHaveCount(1)
  await search.fill("idea")
  await expect(grid.getByRole("button").first()).toHaveAccessibleName(
    "Lightbulb"
  )
  await expect(grid.getByRole("button", { name: "Lightbulb" })).toHaveAttribute(
    "data-highlighted",
    ""
  )
  await expect(preview).toHaveText("Lightbulb")
  // Enter in the search picks the highlighted match, closes the popover and returns focus.
  await search.press("Enter")
  await expect(search).toBeHidden()
  await expect(example.getByRole("button", { name: "Lightbulb" })).toBeFocused()
  // Reopening clears the search.
  await page.keyboard.press("Enter")
  await expect(search).toBeFocused()
  await expect(search).toHaveValue("")
  await expect(grid.getByRole("button", { name: "Lightbulb" })).toHaveAttribute(
    "aria-pressed",
    "true"
  )
  await expect(grid.locator("[data-highlighted]")).toHaveCount(0)
  await search.press("ArrowDown")
  await expect(grid.getByRole("button", { name: "Rocket" })).toBeFocused()
  await page.keyboard.press("ArrowRight")
  await expect(grid.getByRole("button", { name: "Star" })).toBeFocused()
  await expect(preview).toHaveText("Star")
  // A letter in the grid goes back to the search.
  await page.keyboard.type("s")
  await expect(search).toBeFocused()
  await expect(search).toHaveValue("s")
  await search.fill("zzzzzz")
  await expect(grid.getByText("No icons found.")).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(search).toBeHidden()
  await expect(example.getByRole("button", { name: "Lightbulb" })).toBeFocused()
})

test.describe("on a phone", () => {
  test.use({ viewport: { width: 375, height: 800 }, hasTouch: true })

  test("icon picker: the arrows follow the columns that fit, and a tap picks", async ({
    page,
  }) => {
    await openExamples(page, "/docs/core")
    const example = page.locator('[data-example="core/icon-picker"]')
    await example.getByRole("button", { name: "Pick an Icon" }).tap()
    const grid = page.getByRole("group", { name: "Icons" })
    const buttons = grid.getByRole("button")
    const tops = await buttons.evaluateAll((els) =>
      els.map((el) => el.getBoundingClientRect().top)
    )
    const columns = tops.filter((top) => top === tops[0]).length
    expect(columns).toBeGreaterThan(3)
    await buttons.nth(0).focus()
    await page.keyboard.press("ArrowDown")
    await expect(buttons.nth(columns)).toBeFocused()
    await page.keyboard.press("ArrowRight")
    await expect(buttons.nth(columns + 1)).toBeFocused()
    await grid.getByRole("button", { name: "Flame" }).tap()
    await expect(grid).toBeHidden()
    await expect(example.getByRole("button", { name: "Flame" })).toBeVisible()
  })
})
