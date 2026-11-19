import { expect } from "@playwright/test"
import { test } from "./docs-test"

test("every sink tile renders and hydrates without errors", async ({
  page,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on(
    "console",
    (message) => message.type() === "error" && errors.push(message.text())
  )
  await page.goto("/sink")
  const tiles = page.locator("article.tile")
  await expect(tiles.first()).toBeVisible()
  expect(await tiles.count()).toBeGreaterThan(100)
  await expect(page.locator(".tile-error")).toHaveCount(0)
  await expect(tiles.nth(0)).toHaveId("forms-alerts")
  await expect(tiles.nth(3)).toHaveId("language-sheet")
  expect(errors).toEqual([])
})

test("a sink tag filters the tiles and lands in the URL", async ({ page }) => {
  await page.goto("/sink")
  const tiles = page.locator("article.tile")
  await expect(tiles.first()).toBeVisible()
  await tiles
    .first()
    .getByRole("button", { name: "Checkbox", exact: true })
    .click()
  await expect(page).toHaveURL(/[?&]uses=Checkbox\b/)
  const shown = page.locator("article.tile:not([hidden])")
  expect(await shown.count()).toBeLessThan(await tiles.count())
  for (const tile of await shown.all()) {
    await expect(
      tile.getByRole("button", { name: "Checkbox", exact: true })
    ).toHaveAttribute("aria-pressed", "true")
  }
})
