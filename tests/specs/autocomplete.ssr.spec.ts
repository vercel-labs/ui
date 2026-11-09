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
const serverForm = (page: Page) =>
  page.evaluate(
    () => (window as unknown as { __serverForm: string }).__serverForm
  )
const searches = (page: Page) =>
  page.evaluate(
    () =>
      (
        window as unknown as {
          fruitSearches?: { query: string; aborted: boolean }[]
        }
      ).fruitSearches
  )

// React and Vue render to a string in the page, so a load the server started would be recorded too.
test("an async autocomplete loads its first options once, after hydration", async ({
  page,
  open,
}) => {
  await open("autocomplete", { async: "" })
  await page.getByRole("button", { name: "Show fruits" }).click()
  await expect(page.getByRole("option", { name: "Grape" })).toBeVisible()
  expect(await searches(page)).toEqual([{ query: "", aborted: false }])
  expect(await hydrationErrors(page)).toEqual([])
})

test("an autocomplete with text hydrates without mismatches, and its text submits before hydration", async ({
  page,
  open,
}) => {
  await open("autocomplete", { value: "Mango" })
  await expect(page.getByRole("combobox", { name: "Fruit" })).toHaveValue(
    "Mango"
  )
  expect(await serverForm(page)).toBe("fruit=Mango")
  await page.getByRole("combobox", { name: "Fruit" }).fill("gr")
  await expect(page.getByRole("option", { name: "Grape" })).toBeVisible()
  expect(await hydrationErrors(page)).toEqual([])
})
