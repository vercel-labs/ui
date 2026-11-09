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

// Count gates for a long combobox. See tests/perf/budgets.ts.
test.describe("work per interaction in a long combobox", () => {
  test.beforeEach(async ({ page }) => {
    await countCalls(page)
  })

  for (const n of sizes) {
    test(`arrow keys do no work that grows with the option count (n=${n})`, async ({
      page,
      open,
    }) => {
      const budget = budgets["combobox.arrow-key"]
      await open("combobox-perf", { n: String(n) })
      await page.getByRole("combobox", { name: "Search" }).press("ArrowDown")
      const options = page.getByRole("option")
      await expect(options.first()).toHaveAttribute("data-highlighted", "")
      await resetCounts(page)
      // A person's pace, so the frames each key leaves running fall in the count.
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press("ArrowDown")
        await page.waitForTimeout(50)
      }
      // Ten steps from the first option, wrapping around a short list.
      await expect(options.nth(10 % n)).toHaveAttribute("data-highlighted", "")
      const result = await readCounts(page)
      report("combobox.arrow-key", n, result)
      expect(
        result.renders.plain ?? 0,
        "Plain options re-rendered on a highlight change. See tests/perf/README.md#combobox-arrow-key."
      ).toBe(budget.renders.plain)
      expect(
        result.renders.watched ?? 0,
        "See tests/perf/README.md#combobox-arrow-key."
      ).toBeLessThanOrEqual(budget.renders.watched)
      expect(
        result.counts.compareDocumentPosition ?? 0,
        "See tests/perf/README.md#combobox-arrow-key."
      ).toBeLessThanOrEqual(budget.counts.compareDocumentPosition)
      expect(
        result.counts.requestAnimationFrame ?? 0,
        "Moving the highlight woke positioning. See tests/perf/README.md#combobox-arrow-key."
      ).toBeLessThanOrEqual(budget.counts.requestAnimationFrame)
      expect(
        result.counts.getBoundingClientRect ?? 0,
        "See tests/perf/README.md#combobox-arrow-key."
      ).toBeLessThanOrEqual(budget.counts.getBoundingClientRect)
    })

    test(`opening renders each option once (n=${n})`, async ({
      page,
      open,
      framework,
    }) => {
      // Svelte's spread reads `is` once per element it creates, so an open
      // that creates n options reads n attributes, which the budget below
      // counts as options reading theirs back. The renders half holds.
      test.skip(
        framework.startsWith("svelte"),
        "Svelte reads one attribute per element its spread creates."
      )
      const budget = budgets["combobox.open"]
      await open("combobox-perf", { n: String(n) })
      await resetCounts(page)
      await page.getByRole("combobox", { name: "Search" }).press("ArrowDown")
      await expect(page.getByRole("option").first()).toHaveAttribute(
        "data-highlighted",
        ""
      )
      await waitFrames(page, 2)
      const result = await readCounts(page)
      report("combobox.open", n, result)
      const options =
        (result.renders.plain ?? 0) + (result.renders.watched ?? 0)
      expect(
        options,
        "Options rendered more than once when the list opened. See tests/perf/README.md#combobox-open."
      ).toBeLessThanOrEqual(n * budget.renders.perItem)
      // React and Vue compare attributes in memory, so this counts web components.
      expect(
        result.counts.getAttribute ?? 0,
        "Options read their attributes back when the list opened. See tests/perf/README.md#combobox-open."
      ).toBeLessThanOrEqual(budget.counts.getAttribute)
    })

    test(`typing what every option matches reaches no option (n=${n})`, async ({
      page,
      open,
    }) => {
      const budget = budgets["combobox.type"]
      await open("combobox-perf", { n: String(n) })
      const input = page.getByRole("combobox", { name: "Search" })
      await input.press("ArrowDown")
      await expect(page.getByRole("option").first()).toHaveAttribute(
        "data-highlighted",
        ""
      )
      await resetCounts(page)
      await page.keyboard.press("I")
      await expect(input).toHaveValue("I")
      await waitFrames(page, 2)
      await expect(page.locator('[role="option"]:not([hidden])')).toHaveCount(n)
      const result = await readCounts(page)
      report("combobox.type", n, result)
      expect(
        result.renders.plain ?? 0,
        "Options that still match rendered again. See tests/perf/README.md#combobox-type."
      ).toBe(budget.renders.plain)
      expect(
        result.renders.watched ?? 0,
        "See tests/perf/README.md#combobox-type."
      ).toBeLessThanOrEqual(budget.renders.watched)
      expect(
        result.counts.compareDocumentPosition ?? 0,
        "See tests/perf/README.md#combobox-type."
      ).toBeLessThanOrEqual(budget.counts.compareDocumentPosition)
      // React and Vue compare attributes in memory, so this counts web components.
      expect(
        result.counts.getAttribute ?? 0,
        "Options that still match read their attributes back. See tests/perf/README.md#combobox-type."
      ).toBeLessThanOrEqual(budget.counts.getAttribute)
    })

    test(`typing a filter renders no option it hides (n=${n})`, async ({
      page,
      open,
      framework,
    }) => {
      test.skip(framework === "web", "Web components have no renders to count.")
      const budget = budgets["combobox.type"]
      await open("combobox-perf", { n: String(n) })
      const input = page.getByRole("combobox", { name: "Search" })
      await input.press("ArrowDown")
      await expect(page.getByRole("option").first()).toHaveAttribute(
        "data-highlighted",
        ""
      )
      await resetCounts(page)
      await page.keyboard.press("7")
      const matching = Array.from(
        { length: n },
        (_, index) => `Item ${index + 1}`
      ).filter((label) => label.includes("7")).length
      await expect(page.locator('[role="option"]:not([hidden])')).toHaveCount(
        matching
      )
      await waitFrames(page, 2)
      const result = await readCounts(page)
      report("combobox.type filter", n, result)
      // Core writes `hidden` itself, so no hidden option renders. The highlight may move between options that read it.
      const rendered =
        (result.renders.plain ?? 0) + (result.renders.watched ?? 0)
      expect(
        rendered,
        "Options rendered when a filter hid them. See tests/perf/README.md#combobox-type."
      ).toBeLessThanOrEqual(
        (n - matching) * budget.rendersPerChangedOption + budget.renders.watched
      )
    })
  }
})
