import { expect, test } from "../fixtures"
import { budgets } from "../perf/budgets"
import { countDrag, countKeys, expectWithin } from "../perf/drag"
import { countCalls, report, sizes } from "../perf/init"

// Count gates for a slider with many thumbs. See tests/perf/budgets.ts.
test.describe("work per move in a slider with many thumbs", () => {
  test.beforeEach(async ({ page }) => {
    await countCalls(page)
  })

  for (const n of sizes) {
    test(`dragging a thumb does no work that grows with the thumb count (n=${n})`, async ({
      page,
      open,
      browserName,
    }) => {
      const budget = budgets["slider.drag"]
      await open("slider-perf", { n: String(n) })
      const control = page.locator(".slider-control")
      const box = (await control.boundingBox())!
      // A press at 700 of 1,000 moves the last thumb there, then each move
      // of 10 pixels drags it about 17 further.
      const result = await countDrag(page, {
        from: { x: box.x + box.width * 0.7, y: box.y + box.height / 2 },
        step: { x: 10, y: 0 },
        trace: browserName === "chromium",
      })
      report("slider.drag", n, result)
      const last = page.getByRole("slider", { name: `Thumb ${n}` })
      expect(Number(await last.inputValue())).toBeGreaterThan(850)
      expectWithin(result, budget, {
        see: "See tests/perf/README.md#slider-drag.",
      })
    })

    test(`arrow keys on a thumb do no work that grows with the thumb count (n=${n})`, async ({
      page,
      open,
    }) => {
      const budget = budgets["slider.step-key"]
      await open("slider-perf", { n: String(n) })
      const last = page.getByRole("slider", { name: `Thumb ${n}` })
      await last.focus()
      const start = Number(await last.inputValue())
      const result = await countKeys(page, "ArrowRight")
      report("slider.step-key", n, result)
      await expect(last).toHaveValue(String(start + 10))
      expectWithin(result, budget, {
        see: "See tests/perf/README.md#slider-step-key.",
      })
    })
  }
})
