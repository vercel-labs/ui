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

// Count gates for a long select. See tests/perf/budgets.ts.
test.describe("work per interaction in a long select", () => {
  test.beforeEach(async ({ page }) => {
    await countCalls(page)
  })

  for (const n of sizes) {
    test(`arrow keys do no work that grows with the option count (n=${n})`, async ({
      page,
      open,
    }) => {
      const budget = budgets["select.arrow-key"]
      await open("select-perf", { n: String(n) })
      await page.getByRole("combobox", { name: "Pick" }).press("Enter")
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
      report("select.arrow-key", n, result)
      expect(
        result.renders.plain ?? 0,
        "Plain options re-rendered on a highlight change. See tests/perf/README.md#select-arrow-key."
      ).toBe(budget.renders.plain)
      expect(
        result.renders.watched ?? 0,
        "See tests/perf/README.md#select-arrow-key."
      ).toBeLessThanOrEqual(budget.renders.watched)
      expect(
        result.counts.compareDocumentPosition ?? 0,
        "See tests/perf/README.md#select-arrow-key."
      ).toBeLessThanOrEqual(budget.counts.compareDocumentPosition)
      expect(
        result.counts.requestAnimationFrame ?? 0,
        "Moving the highlight woke positioning. See tests/perf/README.md#select-arrow-key."
      ).toBeLessThanOrEqual(budget.counts.requestAnimationFrame)
      expect(
        result.counts.getBoundingClientRect ?? 0,
        "See tests/perf/README.md#select-arrow-key."
      ).toBeLessThanOrEqual(budget.counts.getBoundingClientRect)
    })

    test(`opening renders and reads back no option it already rendered (n=${n})`, async ({
      page,
      open,
    }) => {
      const budget = budgets["select.open"]
      await open("select-perf", { n: String(n) })
      // A closed select whose label the root found mounts no options until
      // its trigger is focused or hovered, which renders them hidden.
      const trigger = page.getByRole("combobox", { name: "Pick" })
      await trigger.focus()
      await expect(page.locator('[role="option"]')).toHaveCount(n)
      await resetCounts(page)
      await trigger.press("Enter")
      await expect(page.getByRole("option").first()).toHaveAttribute(
        "data-highlighted",
        ""
      )
      // Changes that follow the first frame, like the side, land by then.
      await waitFrames(page, 2)
      const result = await readCounts(page)
      report("select.open", n, result)
      expect(
        result.renders.plain ?? 0,
        "Options rendered again when the select opened. See tests/perf/README.md#select-open."
      ).toBe(budget.renders.plain)
      expect(
        result.renders.watched ?? 0,
        "See tests/perf/README.md#select-open."
      ).toBeLessThanOrEqual(budget.renders.watched)
      // React and Vue compare attributes in memory, so this counts web components.
      expect(
        result.counts.getAttribute ?? 0,
        "Options read their attributes back when the select opened. See tests/perf/README.md#select-open."
      ).toBeLessThanOrEqual(budget.counts.getAttribute)
    })

    test(`a closed select whose label the root found renders no options (n=${n})`, async ({
      page,
      open,
      framework,
    }) => {
      test.skip(
        framework === "web",
        "Web components' options are in the markup from the start."
      )
      // A snippet can't be read before it renders, so the root finds no label
      // and mounts the options hidden to learn it, like a value from a controller.
      test.skip(
        framework.startsWith("svelte"),
        "Svelte roots can't read their items' labels before they mount."
      )
      await open("select-perf", { n: String(n) })
      await expect(page.getByRole("combobox", { name: "Pick" })).toHaveText(
        "Item 1"
      )
      await waitFrames(page, 2)
      expect(
        (await readCounts(page)).renders.plain ?? 0,
        "A closed select rendered its options."
      ).toBe(0)
      await expect(page.locator('[role="option"]')).toHaveCount(0)
    })
  }
})
