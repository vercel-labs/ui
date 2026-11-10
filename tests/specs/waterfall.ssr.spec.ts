import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"
import { bar, row, variable } from "./waterfall.helpers"

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const hydrationErrors = (page: Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors
  )

test("a waterfall hydrates without mismatches", async ({ page, open }) => {
  await open("waterfall", { expanded: "document" })
  await expect(row(page, "GET /app.js")).toBeVisible()
  await row(page, "GET /app.js")
    .locator('[data-slot="waterfall-indicator"]')
    .click()
  await expect(row(page, "GET /api/user")).toBeVisible()
  expect(await hydrationErrors(page)).toEqual([])
})

test("the server's markup has one tab stop, on the selected row", async ({
  page,
  open,
}) => {
  await open("waterfall", { expanded: "document", default: "styles" })
  await expect(page.locator('[role="row"][tabindex="0"]')).toHaveCount(1)
  await expect(row(page, "GET /app.css")).toHaveAttribute("tabindex", "0")
  expect(await hydrationErrors(page)).toEqual([])
})

test("levels, positions, bars and their labels render on the server", async ({
  page,
  open,
}) => {
  await open("waterfall", { expanded: "document" })
  await expect(row(page, "GET /app.js")).toHaveAttribute("aria-level", "2")
  await expect(row(page, "GET /app.js")).toHaveAttribute("aria-posinset", "2")
  expect(await variable(row(page, "GET /app.js"), "--waterfall-size")).toBe(
    "24%"
  )
  await expect(bar(page, "GET /app.js")).toHaveAttribute(
    "aria-label",
    "GET /app.js, starts at 120 ms, lasts 480 ms"
  )
  expect(await hydrationErrors(page)).toEqual([])
})
