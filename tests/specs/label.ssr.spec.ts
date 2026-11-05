import { expect, test } from "../fixtures"
import { labelFixture } from "../fixtures/label"

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const hydrationErrors = (page: import("@playwright/test").Page) =>
  page.evaluate(() => (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors)

test("labels hydrate without mismatches, and name their controls", async ({ page, open }) => {
  await open("label")
  await page.waitForLoadState("networkidle")
  await expect(page.getByRole("radiogroup", { name: labelFixture.plan.label })).toBeVisible()
  await expect(page.getByRole("slider", { name: labelFixture.volume.label })).toBeVisible()
  expect(await hydrationErrors(page)).toEqual([])
})
