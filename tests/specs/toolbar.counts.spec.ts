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
test.describe("work per interaction in a long toolbar", () => {
  for (const n of sizes) {
    test(`arrow keys do no work that grows with the item count (n=${n})`, async ({
      page,
      open,
    }) => {
      const budget = budgets["toolbar.arrow-key"]
      await countCalls(page)
      await open("toolbar-perf", { n: String(n) })
      const buttons = page.getByRole("toolbar").getByRole("button")
      await buttons.first().focus()
      await resetCounts(page)
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press("ArrowRight")
      }
      // Ten steps from the first button, wrapping around a short toolbar.
      await expect(buttons.nth(10 % n)).toBeFocused()
      const result = await readCounts(page)
      report("toolbar.arrow-key", n, result)
      expect(
        result.counts.compareDocumentPosition ?? 0,
        "See tests/perf/README.md#toolbar-arrow-key."
      ).toBeLessThanOrEqual(budget.counts.compareDocumentPosition)
    })
  }
})
