import { expect, test } from "../fixtures"
import { budgets } from "../perf/budgets"
import {
  countCalls,
  readCounts,
  report,
  resetCounts,
  sizes,
} from "../perf/init"

// Count gates for roving focus. See tests/perf/budgets.ts.
test.describe("work per interaction in a long tab list", () => {
  for (const n of sizes) {
    test(`arrow keys do no work that grows with the tab count (n=${n})`, async ({
      page,
      open,
    }) => {
      const budget = budgets["tabs.arrow-key"]
      await countCalls(page)
      await open("tabs-perf", { n: String(n) })
      const tabs = page.getByRole("tab")
      await tabs.first().focus()
      // The first switch sets the activation direction, which every tab and
      // panel shows, so it's taken before counting.
      await page.keyboard.press("ArrowRight")
      await expect(tabs.nth(1 % n)).toHaveAttribute("aria-selected", "true")
      await resetCounts(page)
      // A person's pace, so the frames each switch leaves running fall in the count.
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press("ArrowRight")
        await page.waitForTimeout(50)
      }
      // Eleven steps from the first tab, wrapping around a short list.
      await expect(tabs.nth(11 % n)).toBeFocused()
      await expect(tabs.nth(11 % n)).toHaveAttribute("aria-selected", "true")
      const result = await readCounts(page)
      report("tabs.arrow-key", n, result)
      expect(
        result.counts.compareDocumentPosition ?? 0,
        "See tests/perf/README.md#tabs-arrow-key."
      ).toBeLessThanOrEqual(budget.counts.compareDocumentPosition)
      expect(
        result.counts.getAttribute ?? 0,
        "Parts a switch doesn't change heard about it. See tests/perf/README.md#tabs-arrow-key."
      ).toBeLessThanOrEqual(budget.counts.getAttribute)
      expect(
        result.counts.requestAnimationFrame ?? 0,
        "A switch asked for more than its panel's first frame. See tests/perf/README.md#tabs-arrow-key."
      ).toBeLessThanOrEqual(budget.counts.requestAnimationFrame)
    })
  }
})
