import { expect, test } from "../fixtures"
import { budgets } from "../perf/budgets"
import { report, sizes, watchSettle } from "../perf/init"
import type { Locator, Page } from "@playwright/test"

// Count gates for reopening a popup: the frames until it settles. See
// tests/perf/budgets.ts.

// Opens and closes the popup once, then counts the frames its second open takes.
async function framesToReopen(page: Page, trigger: Locator, popup: string) {
  await trigger.press("Enter")
  await expect(page.locator(popup).first()).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(page.locator(popup).first()).toBeHidden()
  await expect(trigger).toBeFocused()
  const settled = await watchSettle(page, popup)
  await page.keyboard.press("Enter")
  const frames = await settled()
  report("popup.reopen", Number(new URL(page.url()).searchParams.get("n")), {
    counts: { frames },
    renders: {},
    subscriptions: 0,
  })
  return frames
}

test.describe("frames to reopen a popup", () => {
  for (const n of sizes) {
    test(`a menu settles in the frame it reopens (n=${n})`, async ({
      page,
      open,
    }) => {
      const budget = budgets["popup.reopen"]
      await open("menu-perf", { n: String(n) })
      const frames = await framesToReopen(
        page,
        page.getByRole("button", { name: "File" }),
        '[role="menu"]'
      )
      expect(
        frames,
        "The menu settled late. See tests/perf/README.md#popup-reopen."
      ).toBeLessThanOrEqual(budget.frames)
    })

    test(`a select settles in the frame it reopens (n=${n})`, async ({
      page,
      open,
    }) => {
      const budget = budgets["popup.reopen"]
      await open("select-perf", { n: String(n) })
      const trigger = page.getByRole("combobox", { name: "Pick" })
      const frames = await framesToReopen(page, trigger, '[role="listbox"]')
      expect(
        frames,
        "The list settled late. See tests/perf/README.md#popup-reopen."
      ).toBeLessThanOrEqual(budget.frames)
    })

    test(`a popover settles in the frame it reopens (n=${n})`, async ({
      page,
      open,
    }) => {
      const budget = budgets["popup.reopen"]
      await open("popover-perf", { n: String(n) })
      const trigger = page.getByRole("button", { name: "Item 1", exact: true })
      const frames = await framesToReopen(page, trigger, '[role="dialog"]')
      expect(
        frames,
        "The popover settled late. See tests/perf/README.md#popup-reopen."
      ).toBeLessThanOrEqual(budget.frames)
    })

    test(`a dialog settles in the frame it reopens (n=${n})`, async ({
      page,
      open,
    }) => {
      const budget = budgets["popup.reopen"]
      await open("dialog-perf", { n: String(n) })
      const trigger = page.getByRole("button", {
        name: "Delete Item 1",
        exact: true,
      })
      const frames = await framesToReopen(page, trigger, '[role="dialog"]')
      expect(
        frames,
        "The dialog settled late. See tests/perf/README.md#popup-reopen."
      ).toBeLessThanOrEqual(budget.frames)
    })
  }
})
