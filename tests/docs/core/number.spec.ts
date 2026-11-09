import { expect } from "@playwright/test"
import { test } from "../docs-test"
import { openExamples } from "./behaviors/helpers"

test("every example renders without errors", async ({ page }) => {
  const { errors } = await openExamples(page, "/docs/core/number")
  await expect(page.locator("[data-example]")).toHaveCount(5)
  await expect(page.locator("figure > figcaption")).toHaveCount(5)
  expect(errors).toEqual([])
})

test("steps: arrows step by the step, Shift and Alt by the large and small steps, Home and End to the bounds", async ({
  page,
}) => {
  await openExamples(page, "/docs/core/number")
  const quantity = page.getByRole("spinbutton", { name: "Quantity in kg" })
  await expect(quantity).toHaveAttribute("aria-valuenow", "2.5")
  await quantity.focus()
  await page.keyboard.press("ArrowUp")
  await expect(quantity).toHaveAttribute("aria-valuenow", "3")
  await page.keyboard.press("Shift+ArrowUp")
  await expect(quantity).toHaveAttribute("aria-valuenow", "8")
  await page.keyboard.press("Alt+ArrowDown")
  await expect(quantity).toHaveAttribute("aria-valuenow", "7.9")
  await expect(quantity).toHaveAttribute("aria-valuetext", "7.9 kg")
  await page.keyboard.press("ArrowLeft")
  await expect(quantity).toHaveAttribute("aria-valuenow", "7.9")
  await page.keyboard.press("End")
  await expect(quantity).toHaveAttribute("aria-valuenow", "20")
  await page.keyboard.press("Home")
  await expect(quantity).toHaveAttribute("aria-valuenow", "0")
  // Typed weights read when they're committed, and snap to the step.
  await quantity.fill("4.3")
  await page.keyboard.press("Enter")
  await expect(quantity).toHaveAttribute("aria-valuenow", "4.5")
  await expect(quantity).toHaveValue("4.5")
  // A key while typing steps from what's typed.
  await quantity.fill("7")
  await page.keyboard.press("ArrowUp")
  await expect(quantity).toHaveValue("7.5")
  await quantity.fill("9.2")
  await quantity.blur()
  await expect(quantity).toHaveValue("9")
})

test("scale: the slider turns the needle, and a log scale gives small angles most of the slider", async ({
  page,
}) => {
  await openExamples(page, "/docs/core/number")
  const angle = page.locator("[data-angle]")
  const position = page.locator("[data-position]")
  const slider = page.getByRole("slider", { name: "Rotation" })
  await expect(angle).toHaveText("45°")
  await expect(position).toHaveText("73% along")
  await page.getByRole("radio", { name: "Linear" }).click()
  await expect(angle).toHaveText("45°")
  await expect(position).toHaveText("25% along")
  await slider.fill("0.5")
  await expect(angle).toHaveText("91°")
  await page.getByRole("radio", { name: "Log" }).click()
  await slider.fill("0.5")
  await expect(angle).toHaveText("13°")
  await expect(slider).toHaveAttribute("aria-valuetext", "13°")
  await expect(page.locator("[data-needle]")).toHaveAttribute(
    "style",
    /rotate: -13\.4\d*deg/
  )
  await slider.fill("1")
  await expect(angle).toHaveText("180°")
})

test("scrub: the playhead snaps to sections, keys stop at them, and Command scrubs freely", async ({
  page,
}) => {
  await openExamples(page, "/docs/core/number")
  const slider = page.getByRole("slider", { name: "Playhead" })
  const time = page.locator("[data-time]")
  const section = page.locator("[data-section]")
  await slider.fill("23")
  await expect(time).toHaveText("0:24.0")
  await expect(section).toHaveText("Chorus")
  await expect(slider).toHaveAttribute("aria-valuetext", "0:24.0, Chorus")
  await slider.fill("30")
  await expect(section).toHaveText("Between sections")
  // Keys stop at a section ahead, and leave the one they're on.
  await slider.fill("22.4")
  await slider.focus()
  await page.keyboard.press("ArrowRight")
  await expect(time).toHaveText("0:24.0")
  await page.keyboard.press("ArrowRight")
  await expect(time).toHaveText("0:24.1")
  await page.keyboard.press("ArrowLeft")
  await expect(time).toHaveText("0:24.0")
  await slider.fill("22.4")
  await page.keyboard.press("Meta+ArrowRight")
  await expect(time).toHaveText("0:22.5")
  // A press near a section lands on it, and with Command held, where it was pressed. A press on the
  // thumb itself changes nothing, so it starts away from there.
  await slider.scrollIntoViewIfNeeded()
  const box = (await slider.boundingBox())!
  const at = (seconds: number) => ({
    x: box.x + (box.width * seconds) / 60,
    y: box.y + box.height / 2,
  })
  await slider.fill("5")
  await page.mouse.click(at(23.2).x, at(23.2).y)
  await expect(time).toHaveText("0:24.0")
  await slider.fill("5")
  await page.keyboard.down("Meta")
  await page.mouse.click(at(23.2).x, at(23.2).y)
  await page.keyboard.up("Meta")
  await expect(section).toHaveText("Between sections")
  await expect(time).not.toHaveText("0:05.0")
})

test("format: the value, its range and its parts follow the locale and the style", async ({
  page,
}) => {
  await openExamples(page, "/docs/core/number")
  await expect(page.locator("[data-plain]")).toHaveText("€1,234.50")
  await expect(
    page.locator("[data-formatted] [data-type=currency]")
  ).toHaveText("€")
  await page.getByLabel("Locale").first().selectOption("de-DE")
  await expect(page.locator("[data-plain]")).toHaveText("1.234,50 €")
  await expect(page.locator("[data-formatted]")).toHaveText("1.234,50 €")
  await page.getByLabel("Style").selectOption("Compact")
  await expect(page.locator("[data-plain]")).toHaveText("1,2 Mio.")
  await page.getByLabel("Locale").first().selectOption("zh-CN")
  await expect(page.locator("[data-plain]")).toHaveText("123万")
  await page.getByLabel("Locale").first().selectOption("ja-JP")
  await page.getByLabel("Style").selectOption("Currency")
  await expect(page.locator("[data-plain]")).toHaveText("€1,234.50")
  await expect(page.locator("[data-range]")).not.toBeEmpty()
})

test("parse: typed numbers read in the locale, partial ones wait, and others are marked", async ({
  page,
}) => {
  await openExamples(page, "/docs/core/number")
  const amount = page.getByLabel("Amount")
  const parsed = page
    .locator('[data-example="behaviors/number-parse"]')
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()
  await amount.fill("1.234,50")
  await expect(parsed).toHaveText("“1.234,50” in de-DE: 1234.5")
  await amount.fill("-")
  await expect(parsed).toHaveText("“-” in de-DE: keep typing")
  await expect(amount).toHaveAttribute("aria-invalid", "false")
  await amount.fill("twelve")
  await expect(parsed).toHaveText("“twelve” in de-DE: not a number")
  await expect(amount).toHaveAttribute("aria-invalid", "true")
  await page.getByLabel("Locale").last().selectOption("en-US")
  await amount.fill("1,234.5")
  await expect(parsed).toHaveText("“1,234.5” in en-US: 1234.5")
})
