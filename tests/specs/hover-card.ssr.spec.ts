import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const hydrationErrors = (page: Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors
  )

test("a closed card hydrates without mismatches", async ({ page, open }) => {
  await open("hover-card")
  await expect(async () => {
    await page.mouse.move(0, 0)
    await page.getByRole("link", { name: "@ada" }).hover()
    await expect(page.getByRole("link", { name: "View profile" })).toBeVisible({
      timeout: 500,
    })
  }).toPass()
  expect(await hydrationErrors(page)).toEqual([])
})

test("an open card hydrates without mismatches and leaves focus alone", async ({
  page,
  open,
}) => {
  await open("hover-card", { open: "" })
  await expect(page.getByRole("link", { name: "View profile" })).toBeVisible()
  expect(await hydrationErrors(page)).toEqual([])
  expect(
    await page.evaluate(() => document.activeElement === document.body)
  ).toBe(true)
})

test("an open card is visible before it hydrates", async ({ page, open }) => {
  await open("hover-card", { open: "" })
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { __visibleBeforeHydration: boolean })
          .__visibleBeforeHydration
    )
  ).toBe(true)
})
