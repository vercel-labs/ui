import { expect, test } from "../fixtures"
import { budgets } from "../perf/budgets"
import { countRestyles, report, sizes, waitFrames } from "../perf/init"
import type { Locator, Page } from "@playwright/test"

// Count gates for opening a modal popup over a large page: how often the
// whole page restyles. See tests/perf/budgets.ts.

// Opens the popup and counts the style recalculations that restyled more
// elements than the page has buttons, which only a whole-page one does.
async function pageRestyles(
  page: Page,
  trigger: Locator,
  popup: Locator,
  n: number
) {
  // Work a popup prepares while the page is idle, ahead of its first open.
  await page.evaluate(
    () => new Promise((resolve) => requestIdleCallback(resolve))
  )
  await waitFrames(page, 2)
  const restyled = await countRestyles(page, async () => {
    await trigger.press("Enter")
    await expect(popup).toBeVisible()
    await waitFrames(page, 2)
  })
  const whole = restyled.each.filter((count) => count > n).length
  report("popup.open-modal", n, {
    counts: { pageRestyles: whole },
    renders: {},
    subscriptions: 0,
  })
  return whole
}

test.describe("restyles to open a modal popup", () => {
  test.beforeEach(({ browserName }) => {
    test.skip(
      browserName !== "chromium",
      "Counts restyled elements from a Chromium trace."
    )
  })

  for (const n of sizes) {
    test(`a modal popover restyles the page once as it opens (n=${n})`, async ({
      page,
      open,
    }) => {
      const budget = budgets["popup.open-modal"]
      await open("popover-perf", { n: String(n), modal: "" })
      const whole = await pageRestyles(
        page,
        page.getByRole("button", { name: "Item 1", exact: true }),
        page.getByRole("dialog"),
        n
      )
      expect(
        whole,
        "The page restyled more than once. See tests/perf/README.md#popup-open-modal."
      ).toBeLessThanOrEqual(budget.pageRestyles)
    })

    test(`a dialog restyles the page once as it opens (n=${n})`, async ({
      page,
      open,
    }) => {
      const budget = budgets["popup.open-modal"]
      await open("dialog-perf", { n: String(n) })
      const whole = await pageRestyles(
        page,
        page.getByRole("button", { name: "Delete Item 1", exact: true }),
        page.getByRole("dialog"),
        n
      )
      expect(
        whole,
        "The page restyled more than once. See tests/perf/README.md#popup-open-modal."
      ).toBeLessThanOrEqual(budget.pageRestyles)
    })
  }
})
