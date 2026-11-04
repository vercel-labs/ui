import { expect, type Locator } from "@playwright/test"
import { testExamples, type Check } from "./docs-helpers"

// The newest line in an example's console.
const lastLog = (preview: Locator) =>
  preview
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()

// Each example's check, in the order they appear on the Progress page.
const checks: Record<string, Check> = {
  basic: async (preview) => {
    await expect(preview.getByRole("progressbar", { name: "Exporting video" })).toHaveAttribute(
      "aria-valuenow",
      "60",
    )
  },
  indeterminate: async (preview) => {
    // A busy bar has no current value.
    const bar = preview.getByRole("progressbar", { name: "Connecting to server" })
    await expect(bar).toBeVisible()
    await expect(bar).not.toHaveAttribute("aria-valuenow")
  },
  controlled: async (preview) => {
    const bar = preview.getByRole("progressbar", { name: "Uploading photos" })
    await expect(bar).toHaveAttribute("aria-valuenow", "20")
    await preview.getByRole("button", { name: "Upload Next" }).click()
    await expect(bar).toHaveAttribute("aria-valuenow", "40")
    await expect(preview.getByText("40%")).toBeVisible()
    await expect(lastLog(preview)).toHaveText("Uploaded 2 of 5 photos")
    for (let index = 0; index < 3; index++) await preview.getByRole("button", { name: "Upload Next" }).click()
    // At the end the bar is complete and the button stops advancing it.
    await expect(bar).toHaveAttribute("aria-valuenow", "100")
    await expect(bar).toHaveAttribute("data-complete")
    await expect(lastLog(preview)).toHaveText("Uploaded 5 of 5 photos")
    await preview.getByRole("button", { name: "Upload Next" }).click({ force: true })
    await expect(bar).toHaveAttribute("aria-valuenow", "100")
    await expect(lastLog(preview)).toHaveText("Uploaded 5 of 5 photos")
    await preview.getByRole("button", { name: "Reset" }).click()
    await expect(bar).toHaveAttribute("aria-valuenow", "0")
    await expect(lastLog(preview)).toHaveText("Reset to 0 photos")
  },
  "min-max": async (preview) => {
    const bar = preview.getByRole("progressbar")
    await expect(bar).toHaveAttribute("aria-valuenow", "3")
    await expect(bar).toHaveAttribute("aria-valuemin", "1")
    await expect(preview.getByText("50%")).toBeVisible()
  },
  format: async (preview) => {
    await expect(preview.getByText("120 GB")).toBeVisible()
    await expect(preview.getByText("87.3%")).toBeVisible()
    await expect(preview.getByText("15 min left")).toBeVisible()
  },
  "value-label": async (preview) => {
    await expect(preview.getByRole("progressbar")).toHaveAttribute("aria-valuetext", "3 of 12 files, 25%")
  },
}

// Every check reads its own example, since each example's Code panel stays mounted.
const scoped = Object.fromEntries(
  Object.entries(checks).map(([name, check]): [string, Check] => [
    name,
    (preview, framework) => check(preview.page().locator(`[data-example="progress/${name}"]`), framework),
  ]),
)

testExamples("progress", scoped, "components", [...Object.keys(checks), "label", "render", "rtl"])
