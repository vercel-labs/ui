import { expect, type Locator } from "@playwright/test"
import { testExamples, type Check } from "./docs-helpers"

// The last line an example logged to its console.
function lastLog(preview: Locator) {
  return preview
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()
}

const row = (preview: Locator, label: string) =>
  preview.getByRole("row").filter({
    has: preview.page().getByRole("rowheader", { name: label, exact: true }),
  })

const checks: Record<string, Check> = {
  network: async (preview) => {
    const waterfall = preview.getByRole("treegrid", {
      name: "Network requests",
    })
    await expect(waterfall).toBeVisible()
    await expect(waterfall.locator('[role="row"][tabindex="0"]')).toHaveCount(1)
    await row(preview, "/").focus()
    await preview.page().keyboard.press("ArrowDown")
    await expect(row(preview, "app.css")).toBeFocused()
    await preview.page().keyboard.press("ArrowRight")
    await preview.page().keyboard.press("End")
    await expect(
      row(preview, "app.css").locator('[data-slot="waterfall-bar"]')
    ).toBeFocused()
    await expect(
      row(preview, "app.css").locator('[data-slot="waterfall-bar"]')
    ).toHaveAttribute("aria-label", "8 kB, starts at 190 ms, takes 96 ms")
    await expect(
      preview.locator('[data-slot="waterfall-tick"]').first()
    ).toBeVisible()
  },
  trace: async (preview) => {
    await row(preview, "payments.charge").focus()
    await preview.page().keyboard.press("ArrowRight")
    await expect(row(preview, "gateway.capture")).toBeVisible()
    await preview.page().keyboard.press("ArrowDown")
    await preview.page().keyboard.press("ArrowDown")
    await preview.page().keyboard.press("Enter")
    await expect(lastLog(preview)).toHaveText("Selected gateway")
    await preview.getByRole("button", { name: "Collapse All" }).click()
    await expect(row(preview, "auth.verify")).toHaveCount(0)
  },
  zoom: async (preview) => {
    const metrics = row(preview, "metrics")
    const size = () =>
      metrics.evaluate((el) =>
        getComputedStyle(el).getPropertyValue("--waterfall-size").trim()
      )
    const before = await size()
    await preview.getByRole("button", { name: "Zoom In" }).click()
    await expect.poll(size).not.toBe(before)
  },
  virtualized: async (preview) => {
    await row(preview, "job 1").focus()
    await preview.page().keyboard.press("End")
    await expect(row(preview, "job 2000")).toBeFocused()
    await expect(row(preview, "job 2000")).toHaveAttribute(
      "aria-posinset",
      "2000"
    )
  },
}

testExamples("waterfall", checks, "components", Object.keys(checks))
