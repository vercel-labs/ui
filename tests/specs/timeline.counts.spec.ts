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
test.describe("work per interaction in a long timeline", () => {
  for (const n of sizes) {
    test(`arrow keys do no work that grows with the event count (n=${n})`, async ({
      page,
      open,
    }) => {
      const budget = budgets["timeline.arrow-key"]
      await countCalls(page)
      await open("timeline-perf", { n: String(n) })
      const events = page.getByRole("listitem")
      await events.first().focus()
      await resetCounts(page)
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press("ArrowDown")
      }
      // Ten steps from the first event, wrapping around a short list.
      await expect(events.nth(10 % n)).toBeFocused()
      const result = await readCounts(page)
      report("timeline.arrow-key", n, result)
      expect(
        result.counts.compareDocumentPosition ?? 0,
        "See tests/perf/README.md#timeline-arrow-key."
      ).toBeLessThanOrEqual(budget.counts.compareDocumentPosition)
      expect(
        result.counts.getAttribute ?? 0,
        "Parts a move doesn't change heard about it. See tests/perf/README.md#timeline-arrow-key."
      ).toBeLessThanOrEqual(budget.counts.getAttribute)
    })
  }
})
