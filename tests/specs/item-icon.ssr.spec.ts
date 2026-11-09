import { expect, test } from "../fixtures"

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const hydrationErrors = (page: import("@playwright/test").Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors
  )

test("items with icon parts hydrate without mismatches", async ({
  page,
  open,
}) => {
  await open("item-icons")
  await expect(page.getByRole("tab", { name: "Overview" })).toHaveAttribute(
    "data-has-icon",
    ""
  )
  expect(await hydrationErrors(page)).toEqual([])
})

test("a select and a combobox with a value hydrate, then show its icon", async ({
  page,
  open,
}) => {
  await open("item-icons", { selected: "" })
  await expect(page.locator('[data-slot="select-value-icon"]')).toHaveText("🍎")
  await expect(page.locator('[data-slot="combobox-value-icon"]')).toHaveText(
    "🇫🇷"
  )
  expect(await hydrationErrors(page)).toEqual([])
})
