import type { Page } from "@playwright/test"
import { expect } from "../fixtures"

// The listbox and its options, found by name. See fixtures/listbox.ts.
const list = (page: Page) => page.getByRole("listbox", { name: "Toppings" })
const option = (page: Page, name: string) =>
  page.getByRole("option", { name, exact: true })

// The names of the selected options, in list order.
async function selectedNames(page: Page) {
  return list(page)
    .getByRole("option", { selected: true })
    .evaluateAll((options) =>
      options.map((el) => el.textContent?.replace("✓", "").trim() ?? "")
    )
}

async function expectSelected(page: Page, names: string[]) {
  await expect.poll(() => selectedNames(page)).toEqual(names)
}

const reason = (page: Page) => page.getByRole("status", { name: "Reason" })
const submitted = (page: Page) =>
  page.getByRole("status", { name: "Submitted" })

// Tabs from Before into the list.
async function tabIn(page: Page, tab: () => Promise<void>) {
  await page.getByRole("button", { name: "Before" }).focus()
  await tab()
}

export { expectSelected, list, option, reason, selectedNames, submitted, tabIn }
