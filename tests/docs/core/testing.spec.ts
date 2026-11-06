import { expect } from "@playwright/test"
import { test } from "../docs-test"
import { openExamples } from "./behaviors/helpers"

const url = "/docs/behaviors/testing"

test("every example renders without errors", async ({ page }) => {
  const { errors } = await openExamples(page, url)
  await expect(page.locator("[data-example]")).toHaveCount(6)
  await expect(page.locator("figure > figcaption")).toHaveCount(6)
  expect(errors).toEqual([])
})

test("check a pattern: the tabs pass, and fail once unnamed", async ({ page }) => {
  await openExamples(page, url)
  const run = page.getByRole("button", { name: "Check the tabs pattern" })
  await run.click()
  await expect(page.getByRole("status")).toHaveText(/^Passes/)
  await page.getByRole("checkbox", { name: "Leave the tab list unnamed" }).check()
  await run.click()
  await expect(page.getByRole("status")).toContainText("name")
})

for (const [name, button, count] of [
  ["mount a primitive", "Run the test", 6],
  ["typing, hovering and announcements", "Run the tests", 4],
] as const) {
  test(`${name}: every check passes in the page`, async ({ page }) => {
    const { errors } = await openExamples(page, url)
    const example = page
      .locator("[data-example]")
      .filter({ has: page.getByRole("button", { name: button, exact: true }) })
    await example.getByRole("button", { name: button, exact: true }).click()
    const results = example.getByRole("list", { name: "Results" }).getByRole("listitem")
    await expect(results).toHaveCount(count)
    await expect(example.locator('[data-ok="false"]')).toHaveCount(0)
    expect(errors).toEqual([])
  })
}

test("the server's HTML: read-more passes, and a clock in attrs fails", async ({ page }) => {
  await openExamples(page, url)
  const run = page.getByRole("button", { name: "Check the server HTML" })
  await run.click()
  await expect(page.getByRole("status")).toContainText('data-slot="read-more-trigger"')
  await page.getByRole("checkbox", { name: "Read the clock in attrs" }).check()
  await run.click()
  await expect(page.getByRole("status")).toContainText("reads the clock or randomness")
})

test("both directions: the pager passes, and one that ignores direction fails", async ({ page }) => {
  await openExamples(page, url)
  const run = page.getByRole("button", { name: "Check both directions" })
  await run.click()
  await expect(page.getByRole("status")).toHaveText(/^Passes/)
  await page.getByRole("checkbox", { name: "Ignore the direction" }).check()
  await run.click()
  await expect(page.getByRole("status")).toContainText("ArrowLeft")
})

test("reading parts: attributes, state and presence follow the open state", async ({ page }) => {
  await openExamples(page, url)
  await expect(page.locator("[data-attrs]")).toContainText('"aria-expanded":"false"')
  await expect(page.locator("[data-state]")).toHaveText('{"open":false}')
  await expect(page.locator("[data-present]")).toHaveText("false")
  await page.getByRole("checkbox", { name: "Open it" }).check()
  await expect(page.locator("[data-attrs]")).toContainText('"aria-expanded":"true"')
  await expect(page.locator("[data-state]")).toHaveText('{"open":true}')
  await expect(page.locator("[data-present]")).toHaveText("true")
})
