import { allowSolidDiagnostic, expect, test } from "../fixtures"
import { budgets } from "../perf/budgets"
import {
  countCalls,
  countRestyles,
  readCounts,
  report,
  resetCounts,
  sizes,
  waitFrames,
} from "../perf/init"

// Count gates: exact numbers of DOM calls and renders per interaction, at
// several item counts. See tests/perf/budgets.ts for each budget and why.
test.describe("work per interaction in a long menu", () => {
  test.beforeEach(async ({ page }) => {
    await countCalls(page)
  })

  for (const n of sizes) {
    test(`arrow keys do no work that grows with the item count (n=${n})`, async ({
      page,
      open,
    }) => {
      const budget = budgets["menu.arrow-key"]
      await open("menu-perf", { n: String(n) })
      await page.getByRole("button", { name: "File" }).press("Enter")
      const items = page.getByRole("menuitem")
      await expect(items.first()).toBeFocused()
      await resetCounts(page)
      // A person's pace, so the frames each key leaves running fall in the count.
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press("ArrowDown")
        await page.waitForTimeout(50)
      }
      // Ten steps from the first item, wrapping around a short menu, whose
      // checkbox item comes after the plain ones.
      const all = page
        .getByRole("menu")
        .locator('[role="menuitem"], [role="menuitemcheckbox"]')
      await expect(all.nth(10 % (n + 1))).toBeFocused()
      const result = await readCounts(page)
      report("menu.arrow-key", n, result)
      expect(
        result.renders.plain ?? 0,
        "Plain items re-rendered on a highlight change. See tests/perf/README.md#menu-arrow-key."
      ).toBe(budget.renders.plain)
      expect(
        result.renders.watched ?? 0,
        "See tests/perf/README.md#menu-arrow-key."
      ).toBeLessThanOrEqual(budget.renders.watched)
      expect(
        result.counts.compareDocumentPosition ?? 0,
        "See tests/perf/README.md#menu-arrow-key."
      ).toBeLessThanOrEqual(budget.counts.compareDocumentPosition)
      expect(
        result.counts.requestAnimationFrame ?? 0,
        "Moving the highlight woke positioning. See tests/perf/README.md#menu-arrow-key."
      ).toBeLessThanOrEqual(budget.counts.requestAnimationFrame)
    })

    test(`hovering items does no work that grows with the item count (n=${n})`, async ({
      page,
      open,
    }) => {
      const budget = budgets["menu.hover"]
      await open("menu-perf", { n: String(n) })
      await page.getByRole("button", { name: "File" }).click()
      const items = page.getByRole("menuitem")
      await expect(items.first()).toBeVisible()
      // Measured before counting, so only the moves count.
      const centers = await Promise.all(
        Array.from({ length: 10 }, async (_, index) => {
          const box = (await items.nth(index).boundingBox())!
          return { x: box.x + box.width / 2, y: box.y + box.height / 2 }
        })
      )
      await resetCounts(page)
      for (const { x, y } of centers) {
        await page.mouse.move(x, y, { steps: 2 })
      }
      await expect(items.nth(9)).toBeFocused()
      const result = await readCounts(page)
      report("menu.hover", n, result)
      expect(
        result.renders.plain ?? 0,
        "Plain items re-rendered on a highlight change. See tests/perf/README.md#menu-hover."
      ).toBe(budget.renders.plain)
      expect(
        result.renders.watched ?? 0,
        "See tests/perf/README.md#menu-hover."
      ).toBeLessThanOrEqual(budget.renders.watched)
      expect(
        result.counts.compareDocumentPosition ?? 0,
        "See tests/perf/README.md#menu-hover."
      ).toBeLessThanOrEqual(budget.counts.compareDocumentPosition)
    })

    test(`opening the menu renders each item once (n=${n})`, async ({
      page,
      open,
    }) => {
      const budget = budgets["menu.open"]
      await open("menu-perf", { n: String(n) })
      await resetCounts(page)
      await page.getByRole("button", { name: "File" }).press("Enter")
      await expect(page.getByRole("menuitem").first()).toBeFocused()
      // Changes that follow the first render, like the side, land by then.
      await waitFrames(page, 2)
      const result = await readCounts(page)
      report("menu.open", n, result)
      const items = (result.renders.plain ?? 0) + (result.renders.watched ?? 0)
      expect(
        items,
        "Items rendered more than once when the menu opened. See tests/perf/README.md#menu-open."
      ).toBeLessThanOrEqual(n * budget.renders.perItem)
      expect(
        result.renders.checkbox ?? 0,
        "See tests/perf/README.md#menu-open."
      ).toBeLessThanOrEqual(budget.renders.perItem)
    })

    test(`toggling a checkbox item reaches only that item and its indicator (n=${n})`, async ({
      page,
      open,
    }) => {
      const budget = budgets["menu.checkbox"]
      await open("menu-perf", { n: String(n) })
      await page.getByRole("button", { name: "File" }).press("Enter")
      const checkbox = page.getByRole("menuitemcheckbox", {
        name: "Wrap lines",
      })
      await page.keyboard.press("End")
      await expect(checkbox).toBeFocused()
      await resetCounts(page)
      await page.keyboard.press("Space")
      await expect(checkbox).toHaveAttribute("aria-checked", "true")
      // The indicator hears the toggle too, and appears.
      const indicator = checkbox.getByText("✓")
      await expect(indicator).toBeVisible()
      const result = await readCounts(page)
      report("menu.checkbox", n, result)
      expect(
        result.renders.plain ?? 0,
        "Plain items re-rendered for another item's change. See tests/perf/README.md#menu-checkbox."
      ).toBe(budget.renders.plain)
      expect(
        result.renders.watched ?? 0,
        "See tests/perf/README.md#menu-checkbox."
      ).toBe(budget.renders.watched)
      expect(
        result.renders.checkbox ?? 0,
        "See tests/perf/README.md#menu-checkbox."
      ).toBeLessThanOrEqual(budget.renders.checkbox)
      // React and Vue compare attributes in memory, so this counts web components.
      expect(
        result.counts.getAttribute ?? 0,
        "Parts other than the item read their attributes. See tests/perf/README.md#menu-checkbox."
      ).toBeLessThanOrEqual(budget.counts.getAttribute)
      await page.keyboard.press("Space")
      await expect(indicator).toBeHidden()
    })

    test(`scrolling under an open menu restyles only the popup (n=${n})`, async ({
      page,
      open,
      browserName,
    }) => {
      test.skip(
        browserName !== "chromium",
        "Counts restyled elements from a Chromium trace."
      )
      const budget = budgets["menu.scroll"]
      await open("menu-perf", { n: String(n), layout: "tall" })
      await page.getByRole("button", { name: "File" }).press("Enter")
      await expect(page.getByRole("menuitem").first()).toBeFocused()
      await waitFrames(page, 10)
      const restyled = await countRestyles(page, () =>
        page.evaluate(
          () =>
            new Promise<void>((resolve) => {
              let frame = 0
              const step = () => {
                scrollTo(0, 10 + (frame % 20) * 5)
                if (++frame < 30) {
                  requestAnimationFrame(step)
                } else {
                  resolve()
                }
              }
              requestAnimationFrame(step)
            })
        )
      )
      report("menu.scroll", n, {
        counts: { recalcs: restyled.recalcs, elements: restyled.elements },
        renders: {},
        subscriptions: 0,
      })
      expect(
        restyled.recalcs,
        "The page didn't restyle while it scrolled. See tests/perf/README.md#menu-scroll."
      ).toBeGreaterThan(0)
      expect(
        restyled.elements / restyled.recalcs,
        "Elements inside the popup restyled as it moved. See tests/perf/README.md#menu-scroll."
      ).toBeLessThanOrEqual(budget.restyledPerRecalc)
    })

    test(`an open menu reads no layout while nothing moves (n=${n})`, async ({
      page,
      open,
    }) => {
      const budget = budgets["menu.idle"]
      await open("menu-perf", { n: String(n) })
      await page.getByRole("button", { name: "File" }).press("Enter")
      await expect(page.getByRole("menuitem").first()).toBeFocused()
      // Positioning keeps checking for a few frames after the last move.
      await waitFrames(page, 10)
      await resetCounts(page)
      const started = await page.evaluate(() => performance.now())
      await waitFrames(page, 30)
      const elapsed = (await page.evaluate(() => performance.now())) - started
      const result = await readCounts(page)
      report("menu.idle", n, result)
      // One more check than whole periods, since the window can open just before one.
      const checks = Math.floor(elapsed / budget.checkEvery) + 1
      for (const [name, perCheck] of Object.entries(budget.counts)) {
        expect(
          result.counts[name] ?? 0,
          `${name} while nothing moved. See tests/perf/README.md#menu-idle.`
        ).toBeLessThanOrEqual(perCheck * checks)
      }
    })

    test(`parts keep one subscription when they render again (n=${n})`, async ({
      page,
      open,
    }) => {
      allowSolidDiagnostic(
        "HUGE_FAN_OUT",
        "the page renders every part again from one signal, which is what it counts"
      )
      const budget = budgets["slot-state.render"]
      await open("slot-state-perf", { n: String(n) })
      const renders = page.getByRole("status", { name: "Renders" })
      await expect(renders).toHaveText("0")
      const mounted = await readCounts(page)
      report("slot-state.mount", n, mounted)
      expect(
        mounted.subscriptions,
        "Each part subscribes once and binds once when it mounts. See tests/perf/README.md#slot-state-render."
      ).toBe(2 * n)
      await resetCounts(page)
      for (let round = 1; round <= 3; round++) {
        await page.getByRole("button", { name: "Render again" }).click()
        await expect(renders).toHaveText(String(round))
      }
      const result = await readCounts(page)
      report("slot-state.render", n, result)
      expect(
        result.subscriptions,
        "Parts subscribed again when they rendered. See tests/perf/README.md#slot-state-render."
      ).toBe(budget.subscriptions)
    })
  }
})
