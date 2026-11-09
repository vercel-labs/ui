import { expect, lastAction, test } from "../fixtures"
import { expectShown, indicator, nextButton } from "./carousel.helpers"

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const hydrationErrors = (page: import("@playwright/test").Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors
  )

test("the carousel hydrates without mismatches", async ({ page, open }) => {
  await open("carousel")
  await expectShown(page, 0)
  await nextButton(page).click()
  await expectShown(page, 1)
  await expect(indicator(page, 2)).toHaveAttribute("aria-selected", "true")
  expect(await hydrationErrors(page)).toEqual([])
})

test("a carousel that starts on another page hydrates there", async ({
  page,
  open,
}) => {
  await open("carousel", { "default-page": "3" })
  await expectShown(page, 2)
  await expect(indicator(page, 3)).toHaveAttribute("aria-selected", "true")
  expect(await lastAction(page)).toBe("")
  expect(await hydrationErrors(page)).toEqual([])
})

test("a carousel with several slides to a view hydrates and hides the extra indicators", async ({
  page,
  open,
}) => {
  await open("carousel", { "per-view": "3" })
  await expectShown(page, 0, 1, 2)
  await expect(page.getByRole("tab")).toHaveCount(3)
  expect(await hydrationErrors(page)).toEqual([])
})

test("a rotating carousel hydrates without mismatches", async ({
  page,
  open,
}) => {
  await open("carousel", { playing: "", interval: "5000" })
  await expect(
    page.getByRole("button", { name: "Stop slide rotation" })
  ).toBeVisible()
  expect(await hydrationErrors(page)).toEqual([])
})
