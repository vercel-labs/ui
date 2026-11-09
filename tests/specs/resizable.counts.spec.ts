import { expect, test } from "../fixtures"
import { budgets } from "../perf/budgets"
import { countDrag, countKeys, expectWithin } from "../perf/drag"
import { countCalls, report, sizes, waitFrames } from "../perf/init"

// Count gates for a resizable group with many panels. See tests/perf/budgets.ts.
test.describe("work per move in a resizable group with many panels", () => {
  test.beforeEach(async ({ page }) => {
    await countCalls(page)
  })

  for (const n of sizes) {
    test(`dragging a handle does no work that grows with the panel count (n=${n})`, async ({
      page,
      open,
      browserName,
    }) => {
      const budget = budgets["resizable.drag"]
      await open("resizable-perf", { n: String(n) })
      const handle = page.getByRole("separator", {
        name: "Handle 1",
        exact: true,
      })
      await expect(handle).toHaveAttribute("aria-valuenow", "25")
      const box = (await handle.boundingBox())!
      // Each move of 6 pixels is half a percent of the group's 1,200.
      const result = await countDrag(page, {
        from: { x: box.x + box.width / 2, y: box.y + box.height / 2 },
        step: { x: 6, y: 0 },
        trace: browserName === "chromium",
      })
      report("resizable.drag", n, result)
      await expect(handle).toHaveAttribute("aria-valuenow", "31")
      expectWithin(result, budget, {
        see: "See tests/perf/README.md#resizable-drag.",
      })
    })

    test(`arrow keys on a handle do no work that grows with the panel count (n=${n})`, async ({
      page,
      open,
    }) => {
      const budget = budgets["resizable.step-key"]
      await open("resizable-perf", { n: String(n) })
      const handle = page.getByRole("separator", {
        name: "Handle 1",
        exact: true,
      })
      await expect(handle).toHaveAttribute("aria-valuenow", "25")
      await handle.focus()
      // The group measures its panels when it first resizes, which WebKit
      // can report a few frames late.
      await waitFrames(page, 3)
      const result = await countKeys(page, "ArrowRight")
      report("resizable.step-key", n, result)
      await expect(handle).toHaveAttribute("aria-valuenow", "35")
      expectWithin(result, budget, {
        see: "See tests/perf/README.md#resizable-step-key.",
      })
    })
  }
})
