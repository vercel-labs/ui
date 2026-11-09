import { expect, test } from "../fixtures"
import { budgets } from "../perf/budgets"
import {
  countCalls,
  readCounts,
  report,
  resetCounts,
  sizes,
  waitFrames,
} from "../perf/init"

// Count gates for a long list of collapsibles. See tests/perf/budgets.ts.
test.describe("work in a long list of collapsibles", () => {
  test.beforeEach(async ({ page }) => {
    await countCalls(page)
  })

  for (const n of sizes) {
    test(`opening one does no work that grows with the count (n=${n})`, async ({
      page,
      open,
    }) => {
      const budget = budgets["collapsible.toggle"]
      await open("collapsibles-perf", { n: String(n) })
      const trigger = page.getByRole("button", {
        name: `Folder ${n}`,
        exact: true,
      })
      await expect(trigger).toBeVisible()
      await waitFrames(page, 2)
      await resetCounts(page)
      await trigger.click()
      await expect(trigger).toHaveAttribute("aria-expanded", "true")
      await expect(page.getByText(`Files ${n}`, { exact: true })).toBeVisible()
      await waitFrames(page, 2)
      const result = await readCounts(page)
      report("collapsible.toggle", n, result)
      expect(
        result.counts.compareDocumentPosition ?? 0,
        "See tests/perf/README.md#collapsible-toggle."
      ).toBe(budget.counts.compareDocumentPosition)
      expect(
        result.counts.getAttribute ?? 0,
        "Collapsibles an open doesn't change heard about it. See tests/perf/README.md#collapsible-toggle."
      ).toBeLessThanOrEqual(budget.counts.getAttribute)
    })
  }
})
