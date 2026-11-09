import type { Page } from "@playwright/test"
import { paginationFixture } from "../fixtures/pagination"

// The landmark, found by its name.
const nav = (page: Page) =>
  page.getByRole("navigation", { name: paginationFixture.label })

// A page or a step, a button or a link by its name.
const part = (
  page: Page,
  name: string | number,
  role: "button" | "link" = "button"
) => nav(page).getByRole(role, { name: String(name), exact: true })

// What each entry of the list shows, like ["«", "‹", "1", "…", "10", "›", "»"].
const entries = (page: Page) =>
  nav(page)
    .getByRole("listitem")
    .evaluateAll((items) => items.map((item) => item.textContent?.trim() ?? ""))

// The pages between the steps, like "1 2 3 4 5 … 10".
const range = async (page: Page) => (await entries(page)).slice(2, -2).join(" ")

// The current page's number.
const current = (page: Page) =>
  nav(page)
    .locator('[aria-current="page"]')
    .evaluateAll((items) => items.map((item) => item.textContent?.trim()))

export { current, entries, nav, part, range }
