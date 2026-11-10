import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"
import { budgets } from "../perf/budgets"
import {
  countCalls,
  readCounts,
  report,
  resetCounts,
  sizes,
} from "../perf/init"
import { row } from "./waterfall.helpers"

// Count gates for a long trace. See tests/perf/budgets.ts.
test.describe("work in a long trace", () => {
  test.beforeEach(async ({ page }) => {
    await countCalls(page)
  })

  const request = (page: Page, n: number) => row(page, `Request ${n}`)

  for (const n of sizes) {
    test(`arrow keys and selection do no work that grows with the span count (n=${n})`, async ({
      page,
      open,
    }) => {
      const budget = budgets["waterfall.arrow-key"]
      await open("waterfall-perf", { n: String(n) })
      await expect(request(page, n)).toHaveAttribute("aria-posinset", String(n))
      await request(page, 1).focus()
      await resetCounts(page)
      // A person's pace, so the work each key leaves queued falls in the count.
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press("ArrowDown")
        await page.waitForTimeout(50)
      }
      const last = request(page, Math.min(11, n))
      await expect(last).toBeFocused()
      await page.keyboard.press("Enter")
      await expect(last).toHaveAttribute("aria-selected", "true")
      const result = await readCounts(page)
      report("waterfall.arrow-key", n, result)
      expect(
        result.counts.compareDocumentPosition ?? 0,
        "See tests/perf/README.md#waterfall-arrow-key."
      ).toBeLessThanOrEqual(budget.counts.compareDocumentPosition)
      expect(
        result.counts.getAttribute ?? 0,
        "Rows a key doesn't change heard about it. See tests/perf/README.md#waterfall-arrow-key."
      ).toBeLessThanOrEqual(budget.counts.getAttribute)
      for (const part of ["row", "bar"] as const) {
        expect(
          result.renders[part] ?? 0,
          `Rows a key doesn't change rendered again. See tests/perf/README.md#waterfall-arrow-key.`
        ).toBeLessThanOrEqual(budget.renders[part])
      }
      expect(
        (result.counts.getComputedStyle ?? 0) +
          (result.counts.offsetHeight ?? 0),
        "Up, Down and Enter read styles or layout. See tests/perf/README.md#waterfall-arrow-key."
      ).toBeLessThanOrEqual(
        budget.counts.getComputedStyle + budget.counts.offsetHeight
      )
    })
  }
})
