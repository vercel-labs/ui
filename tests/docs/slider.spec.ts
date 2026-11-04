import { expect, type Locator } from "@playwright/test"
import { testExamples, type Check } from "./docs-helpers"

// The newest line in an example's console.
const lastLog = (preview: Locator) =>
  preview
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()

const thumb = (preview: Locator, name: string) => preview.getByRole("slider", { name, exact: true })
const button = (preview: Locator, name: string) => preview.getByRole("button", { name, exact: true })

// A thumb's value: the range input's, or aria-valuenow on any other element.
const valueOf = (slider: Locator) =>
  slider.evaluate((el) => (el instanceof HTMLInputElement ? el.value : el.getAttribute("aria-valuenow")))

// Checks a thumb's starting value, presses a key on it, and checks the new value.
const moves =
  (name: string, from: string, to: string, key = "ArrowRight"): Check =>
  async (preview) => {
    const slider = thumb(preview, name)
    await expect.poll(() => valueOf(slider), `${name} starts`).toBe(from)
    await slider.focus()
    await preview.page().keyboard.press(key)
    await expect.poll(() => valueOf(slider), `${name} after ${key}`).toBe(to)
  }

// Each example's check, in the order they appear on the Slider page.
const checks: Record<string, Check> = {
  basic: async (preview, framework) => {
    await moves("Volume", "75", "76")(preview, framework)
    await expect(preview.locator('[data-slot="slider-value"]')).toHaveText("76")
  },
  range: async (preview, framework) => {
    await expect(preview.getByRole("group", { name: "Price" })).toBeVisible()
    await moves("Minimum price", "25", "30")(preview, framework)
    await expect(preview.locator('[data-slot="slider-value"]')).toHaveText("$30 – $50")
  },
  multiple: moves("Low", "10", "20"),
  vertical: moves("Bass", "50", "51", "ArrowUp"),
  field: async (preview, framework) => {
    // The label focuses the thumb.
    await preview.getByText("Volume", { exact: true }).click()
    await expect(thumb(preview, "Volume")).toBeFocused()
    await moves("Volume", "0.3", "0.31")(preview, framework)
  },
  disabled: async (preview) => {
    await expect(thumb(preview, "Brightness")).toBeDisabled()
    await expect.poll(() => valueOf(thumb(preview, "Brightness"))).toBe("50")
  },
  controlled: async (preview, framework) => {
    await moves("Minimum temperature", "0.3", "0.4")(preview, framework)
    await expect(lastLog(preview)).toHaveText("0.4 – 0.7 (step-key)")
    await button(preview, "Reset").click()
    await expect.poll(() => valueOf(thumb(preview, "Minimum temperature"))).toBe("0.3")
  },
  step: moves("Year", "2010", "2015"),
  "large-step": async (preview, framework) => {
    await moves("Zoom", "100", "101")(preview, framework)
    await preview.page().keyboard.press("PageUp")
    await expect.poll(() => valueOf(thumb(preview, "Zoom"))).toBe("126")
  },
  "min-steps": async (preview, framework) => {
    await expect(preview.getByRole("group", { name: "Opening hours" })).toBeVisible()
    await moves("Opens", "540", "555")(preview, framework)
    // End stops four hours before the closing time.
    await moves("Opens", "555", "780", "End")(preview, framework)
  },
  format: async (preview, framework) => {
    await moves("Budget", "40", "41")(preview, framework)
    await expect(thumb(preview, "Budget")).toHaveAttribute("aria-valuetext", "$41")
  },
  commit: async (preview, framework) => {
    await moves("Brightness", "50", "51")(preview, framework)
    // Committing logs once, after the key comes up.
    await expect(lastLog(preview)).toHaveText("Saved 51 (step-key)")
  },
  controller: async (preview, framework) => {
    await moves("Volume", "40", "41")(preview, framework)
    // The controller moves the slider from outside.
    await button(preview, "Mute").click()
    await expect.poll(() => valueOf(thumb(preview, "Volume"))).toBe("0")
    await expect(lastLog(preview)).toHaveText("Volume 0 (imperative)")
    await button(preview, "Read").click()
    await expect(lastLog(preview)).toHaveText("Volume is 0")
  },
  form: async (preview, framework) => {
    await moves("Minimum price", "200", "210")(preview, framework)
    // Distance submits with the form through its form ID.
    await button(preview, "Save").click()
    await expect(lastLog(preview)).toHaveText("Submitted price=210/800, rating=3, distance=25")
    await button(preview, "Reset").click()
    await expect.poll(() => valueOf(thumb(preview, "Minimum price"))).toBe("200")
  },
  render: async (preview, framework) => {
    await moves("Brightness", "60", "61")(preview, framework)
    await expect(preview.locator('[data-slot="slider-value"]')).toHaveText("61%")
  },
}

// Every check reads its own example, since each example's Code panel stays mounted.
const scoped = Object.fromEntries(
  Object.entries(checks).map(([name, check]): [string, Check] => [
    name,
    (preview, framework) => check(preview.page().locator(`[data-example="slider/${name}"]`), framework),
  ]),
)

testExamples("slider", scoped, "components", [...Object.keys(checks), "rtl"])
