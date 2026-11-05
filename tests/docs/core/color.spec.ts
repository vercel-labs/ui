import { expect, test } from "@playwright/test"
import { openExamples } from "./behaviors/helpers"

test("every example renders without errors", async ({ page }) => {
  const { errors } = await openExamples(page, "/docs/core/color")
  await expect(page.locator("[data-example]")).toHaveCount(2)
  await expect(page.locator("figure > figcaption")).toHaveCount(2)
  expect(errors).toEqual([])
})

test("formats: a typed color shows in each format, mapped into sRGB where a format needs it", async ({
  page,
}) => {
  await openExamples(page, "/docs/core/color")
  const example = page.locator("[data-example]").first()
  const input = example.getByRole("textbox", { name: "Color" })
  await expect(example.locator('[data-format="display-p3"]')).toHaveText(/^color\(display-p3 /)
  await expect(example.locator('[data-format="hex"]')).toHaveText("#00c248")
  await expect(example.locator("[data-gamut]")).toHaveText(/Outside sRGB, inside P3/)
  await input.fill("#7654cd")
  await expect(example.locator('[data-format="srgb"]')).toHaveText("rgb(118 84 205)")
  await expect(example.locator('[data-format="hsl"]')).toHaveText("hsl(256.86 54.75% 56.67%)")
  await expect(example.locator("[data-gamut]")).toHaveText("Every screen shows this color.")
  await input.fill("oklch(0.7 0.35 150)")
  await expect(example.locator("[data-gamut]")).toHaveText(/Outside sRGB and P3/)
  await input.fill("blurple")
  await expect(input).toHaveAttribute("aria-invalid", "true")
  await expect(example.locator("[data-gamut]")).toHaveText("Not a color")
})

test("contrast: the ratio and its verdict follow the picked colors", async ({ page }) => {
  await openExamples(page, "/docs/core/color")
  const example = page.locator("[data-example]").last()
  const ratio = example.locator("[data-ratio]")
  await expect(ratio).toHaveText("3.45:1, Passes for large text only")
  await example.getByLabel("Text").fill("#767676")
  await expect(ratio).toHaveText("4.54:1, Passes for all text")
  await example.getByLabel("Background").fill("#999999")
  await expect(ratio).toHaveText(/Fails for text$/)
})
