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

test("a closed popover hydrates without mismatches", async ({ page, open }) => {
  await open("popover")
  await page.getByRole("button", { name: "Profile" }).click()
  await expect(page.getByRole("dialog", { name: "Edit profile" })).toBeVisible()
  expect(await hydrationErrors(page)).toEqual([])
})

test("shortcut parts hydrate without mismatches, then show the keys for this platform", async ({
  page,
  open,
}) => {
  await open("popover", { shortcut: "" })
  const apple = await page.evaluate(() =>
    /Mac|iPhone|iPad|iPod/.test(navigator.platform)
  )
  const hint = page
    .getByRole("button", { name: "Profile" })
    .locator("[data-slot=popover-shortcut]")
  await expect(hint).toHaveText(apple ? "\u2066⌘I\u2069" : "\u2066Ctrl+I\u2069")
  expect(await hydrationErrors(page)).toEqual([])
})

test("an open popover hydrates without mismatches and keeps focus where it was", async ({
  page,
  open,
}) => {
  await open("popover", { open: "" })
  await expect(page.getByRole("dialog", { name: "Edit profile" })).toBeVisible()
  expect(await hydrationErrors(page)).toEqual([])
  expect(
    await page.evaluate(() => document.activeElement === document.body)
  ).toBe(true)
})

test("an open popover is visible before it hydrates", async ({
  page,
  open,
}) => {
  await open("popover", { open: "" })
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { __visibleBeforeHydration: boolean })
          .__visibleBeforeHydration
    )
  ).toBe(true)
})
