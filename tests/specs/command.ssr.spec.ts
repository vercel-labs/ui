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

test("a command list hydrates without mismatches, then highlights and filters", async ({
  page,
  open,
}) => {
  await open("command")
  const input = page.getByRole("combobox", { name: "Search commands" })
  await expect(page.getByRole("option", { name: "Calendar" })).toHaveAttribute(
    "data-highlighted",
    ""
  )
  await input.fill("bill")
  await expect(page.getByRole("listbox").getByRole("option")).toHaveCount(1)
  expect(await hydrationErrors(page)).toEqual([])
})

test("shortcuts render the same on the server and the client", async ({
  page,
  open,
}) => {
  await open("command")
  await expect(page.getByRole("option", { name: /Profile/ })).toHaveAttribute(
    "aria-keyshortcuts",
    /\+P$/
  )
  expect(await hydrationErrors(page)).toEqual([])
})
