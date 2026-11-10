import type { Page } from "@playwright/test"

// A span's row, found by the header that names it.
const row = (page: Page, label: string) =>
  page
    .getByRole("row")
    .filter({ has: page.getByRole("rowheader", { name: label, exact: true }) })

// The cells of a span's row, its header first.
const cell = (page: Page, label: string, column: number) =>
  row(page, label).locator('[role="rowheader"], [role="gridcell"]').nth(column)

const bar = (page: Page, label: string) =>
  row(page, label).locator('[data-slot="waterfall-bar"]')

export { bar, cell, row }
