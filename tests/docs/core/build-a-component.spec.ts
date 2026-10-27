import { expect, test } from "@playwright/test"
import { openExamples } from "./behaviors/helpers"

test("Build a component's examples render without errors", async ({ page }) => {
  const { errors } = await openExamples(page, "/docs/core/build-a-component")
  await expect(page.locator("[data-example]")).toHaveCount(2)
  expect(errors).toEqual([])
})

test("Mute toggles its pressed state with a click, Enter and Space", async ({ page }) => {
  await openExamples(page, "/docs/core/build-a-component")
  const button = page.locator("[data-example]").first().getByRole("button", { name: "Mute", exact: true })
  await expect(button).toHaveAttribute("aria-pressed", "false")
  await button.click()
  await expect(button).toHaveAttribute("aria-pressed", "true")
  await button.press("Enter")
  await expect(button).toHaveAttribute("aria-pressed", "false")
  await button.press("Space")
  await expect(button).toHaveAttribute("aria-pressed", "true")
})

test("highlighted lines span the code block's full scrollable width", async ({ page }) => {
  await page.goto("/docs/core/build-a-component")
  const pre = page.locator("pre").filter({ hasText: 'onMutedChange: "callback"' }).first()
  await pre.scrollIntoViewIfNeeded()
  const { clientWidth, scrollWidth, bands } = await pre.evaluate((el) => ({
    clientWidth: el.clientWidth,
    scrollWidth: el.scrollWidth,
    bands: [...el.querySelectorAll(".line.highlighted")].map((line) => line.getBoundingClientRect().width),
  }))
  expect(scrollWidth, "the block must overflow for the test to mean anything").toBeGreaterThan(clientWidth)
  expect(bands.length).toBeGreaterThan(0)
  for (const width of bands) expect(width).toBeGreaterThanOrEqual(scrollWidth - 2)
})

test("installation, rendering and the next guide follow the framework docs visited last", async ({
  page,
}) => {
  await page.goto("/docs/vue")
  await page.goto("/docs/core/build-a-component")
  await expect(page.getByRole("tablist", { name: "Framework", exact: true })).toHaveCount(0)
  const content = page.getByRole("main")
  await expect(content).toContainText("npm install @ui-sdk/vue")
  await expect(content).toContainText('import { createParts } from "@ui-sdk/vue/primitive"')
  await expect(content).toContainText('import { muteButton } from "@/lib/mute-button"')
  await expect(content).not.toContainText('from "@ui-sdk/react/primitive"')

  await page.goto("/docs/core/compose-behaviors")
  await expect(content).toContainText('import { createParts } from "@ui-sdk/vue/primitive"')
  await page.goto("/docs/web-components")
  await page.goto("/docs/core/compose-behaviors")
  await expect(content).toContainText("defineParts(rating,")
  await expect(content).toContainText('import { rating } from "./rating"')
  await expect(content).not.toContainText('import { createParts } from "@ui-sdk/vue/primitive"')
  await expect(
    page.locator("pre").filter({ hasText: "const rating = definePrimitive({" }).first(),
  ).toBeVisible()
})
