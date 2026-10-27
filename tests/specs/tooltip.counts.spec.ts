import { expect, tabKey, test } from "../fixtures"
import { budgets } from "../perf/budgets"
import { countKeys, expectWithin } from "../perf/drag"
import { countCalls, report, sizes } from "../perf/init"

// Count gates for a row of tooltip triggers. See tests/perf/budgets.ts.
test.describe("work per focus move across many tooltip triggers", () => {
  for (const n of sizes) {
    test(`tabbing between triggers shows each tooltip and does no work that grows with the trigger count (n=${n})`, async ({
      browserName,
      page,
      open,
    }) => {
      const budget = budgets["tooltip.focus"]
      await countCalls(page)
      await open("tooltips-perf", { n: String(n) })
      await page.getByRole("button", { name: "Before", exact: true }).focus()
      // Ten presses from Before: the first opens the first tooltip, and each
      // after it closes one and opens the next.
      const result = await countKeys(page, tabKey(browserName), {
        afterEach: async (press) => {
          await expect(page.getByRole("button", { name: `Tip ${press}`, exact: true })).toBeFocused()
          await expect(page.getByText(`Hint ${press}`, { exact: true })).toBeVisible()
          await expect(page.locator(".tooltip:visible")).toHaveCount(1)
        },
      })
      report("tooltip.focus", n, result)
      expectWithin(result, budget, { see: "See tests/perf/README.md#tooltip-focus." })
    })
  }
})
