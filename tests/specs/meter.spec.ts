import { expect, test } from "../fixtures"

// The meter pattern: https://www.w3.org/WAI/ARIA/apg/patterns/meter/

const meter = (page: import("@playwright/test").Page, name: string) =>
  page.getByRole("meter", { name, exact: true })

test.beforeEach(async ({ open }) => {
  await open("meter")
})

test("a meter is named by its label and reads its value", async ({ page }) => {
  const storage = meter(page, "Storage")
  await expect(storage).toHaveAttribute("aria-valuenow", "60")
  await expect(storage).toHaveAttribute("aria-valuemin", "0")
  await expect(storage).toHaveAttribute("aria-valuemax", "100")
  await expect(storage).toHaveAttribute("aria-valuetext", "60%")
})

test("the value part shows the formatted value", async ({ page }) => {
  await expect(meter(page, "Storage").locator(".gauge-value")).toHaveText("60%")
})

test("the indicator is as wide as the value", async ({ page }) => {
  const track = await meter(page, "Storage")
    .locator(".gauge-track")
    .boundingBox()
  const indicator = await meter(page, "Storage")
    .locator(".gauge-indicator")
    .boundingBox()
  expect(Math.round(indicator!.width)).toBe(Math.round(track!.width * 0.6))
})

test("a new value updates the meter", async ({ page }) => {
  await page.getByRole("button", { name: "Fill" }).click()
  await expect(meter(page, "Storage")).toHaveAttribute("aria-valuenow", "80")
  await expect(meter(page, "Storage").locator(".gauge-value")).toHaveText("80%")
  await page.getByRole("button", { name: "Reset" }).click()
  await expect(meter(page, "Storage")).toHaveAttribute("aria-valuenow", "60")
})

test("min and max set where the value sits", async ({ page }) => {
  const score = meter(page, "Score")
  await expect(score).toHaveAttribute("aria-valuemin", "1")
  await expect(score).toHaveAttribute("aria-valuemax", "5")
  await expect(score).toHaveAttribute("aria-valuenow", "3")
  await expect(score.locator(".gauge-value")).toHaveText("50%")
  const track = await score.locator(".gauge-track").boundingBox()
  const indicator = await score.locator(".gauge-indicator").boundingBox()
  expect(Math.round(indicator!.width)).toBe(Math.round(track!.width * 0.5))
})

test("a unit format reads the value itself", async ({ page }) => {
  await expect(meter(page, "Disk")).toHaveAttribute("aria-valuetext", "128 GB")
  await expect(meter(page, "Disk").locator(".gauge-value")).toHaveText("128 GB")
})

test("a value label replaces the formatted value for screen readers", async ({
  page,
}) => {
  await expect(meter(page, "Requests")).toHaveAttribute(
    "aria-valuetext",
    "750 of 1000 requests"
  )
  await expect(meter(page, "Requests").locator(".gauge-value")).toHaveText(
    "75%"
  )
})

test("a value above the maximum reads as the maximum and fills the track", async ({
  page,
}) => {
  for (let step = 0; step < 3; step++) {
    await page.getByRole("button", { name: "Fill" }).click()
  }
  const storage = meter(page, "Storage")
  await expect(storage).toHaveAttribute("aria-valuenow", "100")
  await expect(storage.locator(".gauge-value")).toHaveText("100%")
  const track = await storage.locator(".gauge-track").boundingBox()
  const indicator = await storage.locator(".gauge-indicator").boundingBox()
  expect(Math.round(indicator!.width)).toBe(Math.round(track!.width))
})
