import type { Page } from "@playwright/test"
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

// Count gates for a long accordion. See tests/perf/budgets.ts.
test.describe("work in a long accordion", () => {
  test.beforeEach(async ({ page }) => {
    await countCalls(page)
  })

  // Items put in order once, after the last mounts: one sort, which compares
  // each item about log2(n) times at most.
  async function expectOrderedOnce(
    page: Page,
    n: number,
    name: string,
    sorts: number
  ) {
    await expect(
      page.getByRole("button", { name: `Question ${n}`, exact: true })
    ).toBeVisible()
    await waitFrames(page, 2)
    const result = await readCounts(page)
    report(name, n, result)
    expect(
      result.counts.compareDocumentPosition ?? 0,
      "Items were put in order again as each one mounted. See tests/perf/README.md#accordion-mount."
    ).toBeLessThanOrEqual(sorts * Math.ceil(n * Math.log2(n)))
  }

  for (const n of sizes) {
    test(`mounting puts the items in order once (n=${n})`, async ({
      page,
      open,
    }) => {
      const budget = budgets["accordion.mount"]
      await open("accordions-perf", { n: String(n) })
      await expectOrderedOnce(page, n, "accordion.mount", budget.sorts)
    })

    test(`mounting with closed panels kept for find in page puts the items in order once (n=${n})`, async ({
      page,
      open,
    }) => {
      const budget = budgets["accordion.mount"]
      await open("accordions-perf", { n: String(n), found: "" })
      await expectOrderedOnce(page, n, "accordion.mount found", budget.sorts)
    })

    test(`opening an item does no work that grows with the item count (n=${n})`, async ({
      page,
      open,
    }) => {
      const budget = budgets["accordion.toggle"]
      await open("accordions-perf", { n: String(n) })
      const trigger = page.getByRole("button", {
        name: `Question ${n}`,
        exact: true,
      })
      await expect(trigger).toBeVisible()
      await waitFrames(page, 2)
      await resetCounts(page)
      await trigger.click()
      await expect(trigger).toHaveAttribute("aria-expanded", "true")
      await expect(page.getByText(`Answer ${n}`, { exact: true })).toBeVisible()
      await waitFrames(page, 2)
      const result = await readCounts(page)
      report("accordion.toggle", n, result)
      expect(
        result.counts.compareDocumentPosition ?? 0,
        "See tests/perf/README.md#accordion-toggle."
      ).toBe(budget.counts.compareDocumentPosition)
      expect(
        result.counts.getAttribute ?? 0,
        "Items an open doesn't change heard about it. See tests/perf/README.md#accordion-toggle."
      ).toBeLessThanOrEqual(budget.counts.getAttribute)
    })
  }
})
