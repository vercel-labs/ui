import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "../fixtures"
import { segment } from "./date-input.helpers"

async function audit(page: import("@playwright/test").Page) {
  // Page structure rules are about the fixture page, not the components.
  const results = await new AxeBuilder({ page })
    .disableRules(["region", "landmark-one-main", "page-has-heading-one"])
    .analyze()
  return results.violations.map((violation) => `${violation.id}: ${violation.help}`)
}

test("no axe violations at rest", async ({ page, open }) => {
  await open("date-input", { date: "2026-11-02" })
  expect(await audit(page)).toEqual([])
})

test("no axe violations while typing", async ({ page, open }) => {
  await open("date-input")
  await segment(page, "month").click()
  await page.keyboard.type("11")
  expect(await audit(page)).toEqual([])
})

test("no axe violations when invalid or disabled", async ({ page, open }) => {
  await open("date-input", { date: "2026-12-02", max: "2026-11-30" })
  expect(await audit(page)).toEqual([])
  await open("date-input", { disabled: "" })
  expect(await audit(page)).toEqual([])
})

test("each segment says its unit, value and range", async ({ page, open }) => {
  await open("date-input", { date: "2026-11-02" })
  const day = segment(page, "day")
  await expect(day).toHaveAttribute("aria-valuenow", "2")
  await expect(day).toHaveAttribute("aria-valuetext", "02")
  await expect(day).toHaveAttribute("aria-valuemin", "1")
  await expect(day).toHaveAttribute("aria-valuemax", "30")
})

test("an empty segment reads as empty", async ({ page, open }) => {
  await open("date-input")
  await expect(segment(page, "month")).toHaveAttribute("aria-valuetext", "Empty")
  await expect(segment(page, "month")).not.toHaveAttribute("aria-valuenow")
})
