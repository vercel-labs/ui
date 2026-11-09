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

test("the field hydrates without mismatches and opens the menu", async ({
  page,
  open,
}) => {
  await open("trigger-menu")
  const field = page.getByRole("textbox", { name: "Message" })
  await expect(field).toHaveAttribute("aria-autocomplete", "list")
  await field.focus()
  await page.keyboard.type("@al")
  await expect(page.getByRole("option", { name: "Alice Smith" })).toBeVisible()
  expect(await hydrationErrors(page)).toEqual([])
})
