import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"
import { toastFixture, toastRole } from "../fixtures/toast"

const role = () => toastRole

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const hydrationErrors = (page: Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors
  )

test("the region hydrates without mismatches, then shows toasts", async ({
  page,
  open,
}) => {
  await open("toast")
  await page.waitForLoadState("networkidle")
  await page.getByRole("button", { name: toastFixture.basic.trigger }).click()
  await expect(
    page.getByRole(role(), { name: toastFixture.basic.title })
  ).toBeVisible()
  expect(await hydrationErrors(page)).toEqual([])
})

test("the overlay host hydrates without mismatches, then shows toasts", async ({
  page,
  open,
}) => {
  await open("toast", { host: "" })
  await page.waitForLoadState("networkidle")
  await page.getByRole("button", { name: toastFixture.basic.trigger }).click()
  await expect(
    page.getByRole(role(), { name: toastFixture.basic.title })
  ).toBeVisible()
  expect(await hydrationErrors(page)).toEqual([])
})
