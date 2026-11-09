import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"
import { fieldRadiosFixture as f } from "../fixtures/field"

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const radio = (page: Page, name: string) =>
  page.getByRole("radio", { name, exact: true })
const hydrationErrors = (page: Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors
  )

test("each radio is named by the label of its own field before hydration", async ({
  page,
  open,
}) => {
  await open("field-radios", { hydrate: "manual" })
  for (const { label } of f.sizes) {
    await expect(radio(page, label)).toBeVisible()
  }
  await expect(page.getByRole("radiogroup", { name: f.label })).toBeVisible()
})

test("radios in fields of their own hydrate without mismatches", async ({
  page,
  open,
}) => {
  await open("field-radios")
  const [small] = f.sizes
  await page.getByText(small.label, { exact: true }).click()
  await expect(radio(page, small.label)).toBeChecked()
  expect(await hydrationErrors(page)).toEqual([])
})
