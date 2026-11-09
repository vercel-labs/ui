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

// Count gates for a long tree. See tests/perf/budgets.ts.
test.describe("work in a long tree", () => {
  test.beforeEach(async ({ page }) => {
    await countCalls(page)
  })

  const folder = (page: Page, n: number) =>
    page.getByRole("treeitem", { name: `Folder ${n}`, exact: true })

  for (const n of sizes) {
    test(`mounting puts each folder's items in order once (n=${n})`, async ({
      page,
      open,
    }) => {
      const budget = budgets["tree.mount"]
      await open("trees-perf", { n: String(n) })
      await expect(folder(page, n)).toHaveAttribute("aria-posinset", String(n))
      await waitFrames(page, 2)
      const result = await readCounts(page)
      report("tree.mount", n, result)
      expect(
        result.counts.compareDocumentPosition ?? 0,
        "Items were put in order again as each one mounted. See tests/perf/README.md#tree-mount."
      ).toBeLessThanOrEqual(budget.sorts * Math.ceil(n * Math.log2(n)))
    })

    test(`expanding a folder does no work that grows with the item count (n=${n})`, async ({
      page,
      open,
    }) => {
      const budget = budgets["tree.expand"]
      await open("trees-perf", { n: String(n) })
      const last = folder(page, n)
      await expect(last).toHaveAttribute("aria-posinset", String(n))
      await waitFrames(page, 2)
      await resetCounts(page)
      await last.click()
      await expect(last).toHaveAttribute("aria-expanded", "true")
      await expect(
        page.getByRole("treeitem", { name: `File ${n}b`, exact: true })
      ).toHaveAttribute("aria-posinset", "2")
      await waitFrames(page, 2)
      const result = await readCounts(page)
      report("tree.expand", n, result)
      expect(
        result.counts.compareDocumentPosition ?? 0,
        "Expanding put items outside the folder in order. See tests/perf/README.md#tree-expand."
      ).toBeLessThanOrEqual(
        budget.counts.compareDocumentPosition +
          budget.inserts * Math.ceil(Math.log2(n + 2))
      )
      expect(
        result.counts.nextNode ?? 0,
        "Expanding walked the whole tree to put items in order. See tests/perf/README.md#tree-expand."
      ).toBeLessThanOrEqual(budget.counts.nextNode)
      expect(
        result.counts.getAttribute ?? 0,
        "Items an expand doesn't change heard about it. See tests/perf/README.md#tree-expand."
      ).toBeLessThanOrEqual(budget.counts.getAttribute)
    })
  }
})
