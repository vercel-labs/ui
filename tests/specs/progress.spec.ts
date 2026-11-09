import { expect, test } from "../fixtures"

// The progressbar role: https://www.w3.org/TR/wai-aria-1.2/#progressbar

const bar = (page: import("@playwright/test").Page, name: string) =>
  page.getByRole("progressbar", { name, exact: true })

test.beforeEach(async ({ open }) => {
  await open("progress")
})

test("a progress bar is named by its label and reads its value", async ({
  page,
}) => {
  const upload = bar(page, "Uploading")
  await expect(upload).toHaveAttribute("aria-valuenow", "40")
  await expect(upload).toHaveAttribute("aria-valuemin", "0")
  await expect(upload).toHaveAttribute("aria-valuemax", "100")
  await expect(upload).toHaveAttribute("aria-valuetext", "40%")
})

test("the value part shows the formatted value", async ({ page }) => {
  await expect(bar(page, "Uploading").locator(".gauge-value")).toHaveText("40%")
})

test("the indicator is as wide as the value", async ({ page }) => {
  const track = await bar(page, "Uploading")
    .locator(".gauge-track")
    .boundingBox()
  const indicator = await bar(page, "Uploading")
    .locator(".gauge-indicator")
    .boundingBox()
  expect(Math.round(indicator!.width)).toBe(Math.round(track!.width * 0.4))
})

test("a new value updates the bar", async ({ page }) => {
  await page.getByRole("button", { name: "Advance" }).click()
  await expect(bar(page, "Uploading")).toHaveAttribute("aria-valuenow", "60")
  await expect(bar(page, "Uploading").locator(".gauge-value")).toHaveText("60%")
})

test("every part says whether the task is under way, done, or unknown", async ({
  page,
}) => {
  const upload = bar(page, "Uploading")
  await expect(upload).toHaveAttribute("data-progressing", "")
  await expect(upload.locator(".gauge-indicator")).toHaveAttribute(
    "data-progressing",
    ""
  )
  for (let step = 0; step < 3; step++) {
    await page.getByRole("button", { name: "Advance" }).click()
  }
  await expect(upload).toHaveAttribute("data-complete", "")
  await expect(upload).not.toHaveAttribute("data-progressing")
  await expect(upload.locator(".gauge-track")).toHaveAttribute(
    "data-complete",
    ""
  )
  await expect(bar(page, "Loading")).toHaveAttribute("data-indeterminate", "")
})

test("an indeterminate bar has no value", async ({ page }) => {
  const loading = bar(page, "Loading")
  await expect(loading).not.toHaveAttribute("aria-valuenow")
  await expect(loading.locator(".gauge-value")).toHaveText("")
})

test("a unit format reads the value itself", async ({ page }) => {
  await expect(bar(page, "Disk")).toHaveAttribute("aria-valuetext", "128 GB")
  await expect(bar(page, "Disk").locator(".gauge-value")).toHaveText("128 GB")
})

test("a value label replaces the formatted value for screen readers", async ({
  page,
}) => {
  await expect(bar(page, "Files")).toHaveAttribute(
    "aria-valuetext",
    "3 of 12 files"
  )
  await expect(bar(page, "Files").locator(".gauge-value")).toHaveText("25%")
})

test("a value above the maximum reads as the maximum", async ({ page }) => {
  for (let step = 0; step < 5; step++) {
    await page.getByRole("button", { name: "Advance" }).click()
  }
  await expect(bar(page, "Uploading")).toHaveAttribute("aria-valuenow", "100")
})
