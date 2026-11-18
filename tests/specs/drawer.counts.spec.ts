import { expect, test } from "../fixtures"
import { budgets } from "../perf/budgets"
import { countRestyles, report, sizes, waitFrames } from "../perf/init"
import type { Page } from "@playwright/test"

async function measureOpen(
  page: Page,
  open: (fixture: string, options?: Record<string, string>) => Promise<void>,
  n: number,
  phone: boolean
) {
  const budget = budgets["drawer.open"]
  if (phone) {
    await page.setViewportSize({ width: 390, height: 844 })
  }
  await open("drawer-perf", {
    n: String(n),
    ...(phone ? { driver: "scroll-snap" } : {}),
  })
  const trigger = page.getByRole("button", { name: "Open", exact: true })
  const dialog = page.getByRole("dialog")
  // The second open, once the first one's one-time work is done.
  await trigger.click()
  await expect(dialog).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(dialog).toBeHidden()
  await page.evaluate(
    () => new Promise((resolve) => requestIdleCallback(resolve))
  )
  await waitFrames(page, 2)
  const result = await countRestyles(page, async () => {
    await trigger.click()
    await expect(dialog).toBeVisible()
    await waitFrames(page, 2)
  })
  const contentRestyles = result.each.filter((count) => count > n).length
  const contentLayouts = result.layouts.filter((count) => count > n).length
  report(`drawer.open${phone ? "-phone" : ""}`, n, {
    counts: { contentRestyles, contentLayouts },
    renders: {},
    subscriptions: 0,
  })
  expect(
    contentRestyles,
    "The content was styled more than once. See tests/perf/README.md#drawer-open."
  ).toBeLessThanOrEqual(budget.contentRestyles)
  expect(
    contentLayouts,
    "The content was laid out more than once. See tests/perf/README.md#drawer-open."
  ).toBeLessThanOrEqual(budget.contentLayouts)
}

test.describe("drawer open", () => {
  test.beforeEach(({ browserName }) => {
    test.skip(
      browserName !== "chromium",
      "Counts restyles and layouts from a Chromium trace."
    )
  })

  for (const n of sizes) {
    test(`styles and lays out its content once (n=${n})`, async ({
      page,
      open,
    }) => {
      await measureOpen(page, open, n, false)
    })

    test(`styles and lays out its content once on a phone (n=${n})`, async ({
      page,
      open,
    }) => {
      await measureOpen(page, open, n, true)
    })
  }
})
