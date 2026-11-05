import { expect } from "@playwright/test"
import { test } from "../docs-test"
import { openExamples } from "./behaviors/helpers"

test("the introduction's examples render without errors", async ({ page }) => {
  const { errors } = await openExamples(page, "/docs/core")
  await expect(page.locator("[data-example]")).toHaveCount(1)
  expect(errors).toEqual([])
})

test("emoji picker: search, then arrows and Enter pick an emoji", async ({ page }) => {
  await openExamples(page, "/docs/core")
  const example = page.locator('[data-example="core/emoji-picker"]')
  const grid = page.getByRole("group", { name: "Emoji" })
  const footer = page.locator("[data-footer]")
  await expect(grid.locator('[tabindex="0"]')).toHaveCount(1)
  const search = page.getByRole("searchbox", { name: "Search emoji" })
  await search.fill("party")
  await expect(grid.getByRole("button")).toHaveCount(2)
  await expect(grid.getByRole("button").first()).toHaveAccessibleName("party popper")
  // Enter in the search picks the best match.
  await search.press("Enter")
  await expect(footer).toHaveText("🎉Picked party popper")
  await search.press("ArrowDown")
  await expect(grid.getByRole("button", { name: "party popper" })).toBeFocused()
  await page.keyboard.press("ArrowRight")
  await expect(grid.getByRole("button", { name: "partying face" })).toBeFocused()
  await expect(footer).toHaveText("🥳partying face")
  // A letter in the grid goes back to the search.
  await page.keyboard.type("s")
  await expect(search).toBeFocused()
  await expect(search).toHaveValue("partys")
  await search.fill("ship")
  await expect(grid.getByRole("button")).toHaveCount(1)
  await expect(grid.getByRole("button")).toHaveAccessibleName("rocket")
  await search.fill("zzzzzz")
  await expect(example.getByText("No emoji found.")).toBeVisible()
})

test.describe("on a phone", () => {
  test.use({ viewport: { width: 375, height: 800 }, hasTouch: true })

  test("emoji picker: the arrows follow the columns that fit, and a tap picks", async ({ page }) => {
    await openExamples(page, "/docs/core")
    const grid = page.getByRole("group", { name: "Emoji" })
    const buttons = grid.getByRole("button")
    const tops = await buttons.evaluateAll((els) => els.map((el) => el.getBoundingClientRect().top))
    const columns = tops.filter((top) => top === tops[0]).length
    expect(columns).toBeGreaterThan(3)
    await buttons.nth(0).focus()
    await page.keyboard.press("ArrowDown")
    await expect(buttons.nth(columns)).toBeFocused()
    await page.keyboard.press("ArrowRight")
    await expect(buttons.nth(columns + 1)).toBeFocused()
    await grid.getByRole("button", { name: "fire" }).tap()
    await expect(page.locator("[data-footer]")).toContainText("fire")
  })
})
