import { expect, test } from "../fixtures"
import { budgets } from "../perf/budgets"
import { countCalls, readCounts, report, sizes, waitFrames } from "../perf/init"

// Count gates for a page of closed popups: rows like a table's, each with a
// menu, a select and a tooltip. See tests/perf/budgets.ts.
test.describe("work to mount many closed popups", () => {
  test.beforeEach(async ({ page }) => {
    await countCalls(page)
  })

  for (const n of sizes) {
    test(`closed rows grow only with their select's options (n=${n})`, async ({
      page,
      open,
      framework,
    }) => {
      // Svelte mounts 500 rows with 30 options in about 25 s in development, so
      // the test's two loads need more than the default timeout. The counts
      // are the gate.
      test.slow(
        framework.startsWith("svelte") && n >= 500,
        "Svelte's development mount of 500 rows is slow."
      )
      const budget = budgets["rows.mount"]
      // Few options and many, so what grows with the options shows.
      for (const options of [3, 30]) {
        await open("rows-perf", { n: String(n), options: String(options) })
        await expect(
          page.getByRole("button", { name: `Tip ${n}`, exact: true })
        ).toBeVisible()
        // The values render again once their options give them the label,
        // and anything that follows lands in the next frames.
        await expect(
          page.getByRole("combobox", { name: `Select ${n}`, exact: true })
        ).toHaveText("Item 1")
        await waitFrames(page, 2)
        const result = await readCounts(page)
        report(`rows.mount options=${options}`, n, result)
        // Web components have no renders to count.
        if (framework !== "web") {
          const perRow = (name: string) => (result.renders[name] ?? 0) / n
          expect(
            perRow("menuItem"),
            "A closed menu rendered its items. See tests/perf/README.md#rows-mount."
          ).toBe(budget.renders.menuItem)
          expect(
            perRow("trigger"),
            "Triggers rendered more than once. See tests/perf/README.md#rows-mount."
          ).toBe(budget.renders.trigger)
          expect(
            perRow("value"),
            "See tests/perf/README.md#rows-mount."
          ).toBeLessThanOrEqual(budget.renders.value)
          expect(
            perRow("tooltip"),
            "See tests/perf/README.md#rows-mount."
          ).toBeLessThanOrEqual(budget.renders.tooltip)
          expect(
            perRow("option"),
            "Options rendered more than once. See tests/perf/README.md#rows-mount."
          ).toBeLessThanOrEqual(options * budget.renders.perOption)
        }
        // The rows' elements, and any part moved out of them to the body.
        const elements = await page.evaluate(() => {
          const fixture = document.querySelector(".fixture")!
          const outside = [...document.body.children].filter(
            (el) => !el.contains(fixture) && el.matches("[data-slot]")
          )
          return [...document.querySelectorAll(".row"), ...outside].reduce(
            (sum, el) => sum + el.querySelectorAll("*").length + 1,
            0
          )
        })
        const base = budget.elements[framework as "react" | "vue" | "web"]
        expect(
          elements / n,
          "A row has more elements than its parts and options. See tests/perf/README.md#rows-mount."
        ).toBeLessThanOrEqual(base + options * budget.elements.perOption)
      }
    })

    test(`closed rows read no control's labels as they mount (n=${n})`, async ({
      page,
      open,
    }) => {
      const budget = budgets["rows.labels"]
      await open("rows-perf", { n: String(n) })
      await expect(
        page.getByRole("combobox", { name: `Select ${n}`, exact: true })
      ).toHaveText("Item 1")
      await waitFrames(page, 2)
      const result = await readCounts(page)
      report("rows.labels", n, result)
      expect(
        result.counts.labels ?? 0,
        "Mounting read `labels`, which walks the document. See tests/perf/README.md#rows-labels."
      ).toBe(budget.counts.labels)
    })
  }
})
