import { expect, test } from "../fixtures"
import { expectSelected, list, option } from "./listbox.helpers"

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const hydrationErrors = (page: import("@playwright/test").Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors
  )

const serverForm = (page: import("@playwright/test").Page) =>
  page.evaluate(
    () => (window as unknown as { __serverForm: string }).__serverForm
  )

test("the listbox hydrates without mismatches and works", async ({
  page,
  open,
}) => {
  await open("listbox", { value: "cheese", grouped: "" })
  await page.waitForLoadState("networkidle")
  await option(page, "Onion").click()
  await expectSelected(page, ["Onion"])
  expect(await hydrationErrors(page)).toEqual([])
})

test("the server renders one tab stop, on the selected option", async ({
  page,
  open,
}) => {
  await open("listbox", { value: "onion" })
  const stops = list(page).locator('[tabindex="0"]')
  await expect(stops).toHaveCount(1)
  await expect(stops).toHaveText(/Onion/)
  expect(await hydrationErrors(page)).toEqual([])
})

test("the server renders one tab stop on the first option with nothing selected", async ({
  page,
  open,
}) => {
  await open("listbox", { multiple: "" })
  const stops = list(page).locator('[tabindex="0"]')
  await expect(stops).toHaveCount(1)
  await expect(stops).toHaveText(/Basil/)
})

test("the server markup submits the value before hydration", async ({
  page,
  open,
}) => {
  await open("listbox", { multiple: "", value: "basil,pepper" })
  expect(await serverForm(page)).toBe("toppings=basil&toppings=pepper")
  expect(await hydrationErrors(page)).toEqual([])
})
