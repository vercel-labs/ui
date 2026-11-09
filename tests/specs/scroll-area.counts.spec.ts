import { expect, test } from "../fixtures"
import { budgets } from "../perf/budgets"
import { countDrag, expectWithin } from "../perf/drag"
import { countCalls, report, sizes } from "../perf/init"
import type { Page } from "@playwright/test"

// Count gates for a scroll area with many items. See tests/perf/budgets.ts.
// Keys scroll the viewport natively, so there's no keyboard gate.
test.describe("work per move in a scroll area with many items", () => {
  test.beforeEach(async ({ page }) => {
    await countCalls(page)
  })

  // Ten items leave the thumb about 33 pixels to travel, so moves of 3
  // pixels scroll on every one at both sizes.
  async function dragThumb(page: Page, trace: boolean) {
    const thumb = page.locator(".scroll-area-thumb")
    await expect(thumb).toBeVisible()
    const box = (await thumb.boundingBox())!
    const result = await countDrag(page, {
      from: { x: box.x + box.width / 2, y: box.y + 4 },
      step: { x: 0, y: 3 },
      trace,
    })
    const viewport = page.getByRole("region", { name: "Items" })
    expect(await viewport.evaluate((el) => el.scrollTop)).toBeGreaterThan(0)
    return result
  }

  for (const n of sizes) {
    test(`dragging the thumb does no work that grows with the item count (n=${n})`, async ({
      page,
      open,
    }) => {
      const budget = budgets["scroll-area.drag"]
      await open("scroll-area-perf", { n: String(n) })
      const result = await dragThumb(page, false)
      report("scroll-area.drag", n, result)
      expectWithin(result, budget, {
        see: "See tests/perf/README.md#scroll-area-drag.",
      })
    })

    test(`dragging the thumb restyles only the scroll area's own parts (n=${n})`, async ({
      page,
      open,
      browserName,
    }) => {
      test.skip(
        browserName !== "chromium",
        "Counts restyled elements from a Chromium trace."
      )
      const budget = budgets["scroll-area.drag"]
      await open("scroll-area-perf", { n: String(n) })
      const result = await dragThumb(page, true)
      report("scroll-area.restyle", n, result)
      expect(
        result.restyled!.elements / 10,
        "Elements restyled per move. See tests/perf/README.md#scroll-area-drag."
      ).toBeLessThanOrEqual(budget.restyledPerMove)
    })
  }
})
