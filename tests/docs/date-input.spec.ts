import { expect, type Locator } from "@playwright/test"
import { testExamples } from "./docs-helpers"

// The newest line in an example's console.
const lastLog = (preview: Locator) =>
  preview
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()

const segment = (preview: Locator, group: string, unit: string) =>
  preview.getByRole("group", { name: group }).getByRole("spinbutton", { name: unit })

// Each example's check, in the order they appear on the Date Input page.
testExamples(
  "date-input",
  {
    basic: async (preview) => {
      await segment(preview, "Start date", "month").click()
      await preview.page().keyboard.type("11042026")
      await expect(segment(preview, "Start date", "year")).toHaveValue("2026")
    },
    field: async (preview) => {
      await preview.getByText("Birthday", { exact: true }).click()
      await expect(segment(preview, "Birthday", "month")).toBeFocused()
    },
    "date-time": async (preview) => {
      await expect(segment(preview, "Departure", "hour")).toHaveValue("02")
    },
    "min-max": async (preview) => {
      await segment(preview, "Check-in", "year").click()
      await preview.page().keyboard.press("ArrowUp")
      await expect(preview.getByRole("group", { name: "Check-in" })).toHaveAttribute("data-invalid", "")
    },
    unavailable: async (preview) => {
      await segment(preview, "Delivery date", "day").click()
      await preview.page().keyboard.press("ArrowDown")
      await expect(preview.getByRole("group", { name: "Delivery date" })).toHaveAttribute("data-invalid", "")
    },
    locale: async (preview) => {
      const first = preview.getByRole("group", { name: "Date (en-GB)" }).getByRole("spinbutton").first()
      await expect(first).toHaveValue("02")
    },
    disabled: async (preview) => {
      await expect(segment(preview, "Start date", "month")).toBeDisabled()
    },
    "read-only": async (preview) => {
      const month = segment(preview, "Signed on", "month")
      await month.click()
      await preview.page().keyboard.press("ArrowUp")
      await expect(month).toHaveValue("11")
    },
    form: async (preview) => {
      await preview.getByRole("button", { name: "Book" }).click()
      await expect(lastLog(preview)).toHaveText("Submitted date=2026-11-02, time=09:30")
    },
    controlled: async (preview) => {
      await segment(preview, "Due date", "day").click()
      await preview.page().keyboard.press("ArrowUp")
      await expect(lastLog(preview)).toHaveText("Due date 2026-11-03")
      await preview.getByRole("button", { name: "Clear" }).click()
      await expect(segment(preview, "Due date", "day")).toHaveValue("")
    },
    controller: async (preview) => {
      await preview.getByRole("button", { name: "Christmas" }).click()
      await expect(segment(preview, "Publish on", "month")).toHaveValue("12")
    },
    segments: async (preview, framework) => {
      await expect(segment(preview, "Start date", "month")).toHaveValue("11")
      // Web copies a template, so its separators stay the locale's.
      if (framework !== "web-components") await expect(preview.getByText("–").first()).toBeVisible()
    },
  },
  "components",
  [
    "basic",
    "field",
    "date-time",
    "min-max",
    "unavailable",
    "locale",
    "disabled",
    "read-only",
    "form",
    "controlled",
    "controller",
    "segments",
    "time",
    "hour-cycle",
  ],
)

// Time Input's page shows the time examples from the same folder.
testExamples(
  "time-input",
  {
    time: async (preview) => {
      await segment(preview, "Meeting time", "hour").click()
      await preview.page().keyboard.type("230p")
      await expect(segment(preview, "Meeting time", "AM/PM")).toHaveValue("PM")
    },
    "hour-cycle": async (preview) => {
      await expect(preview.getByRole("group", { name: "24-hour clock" }).getByRole("spinbutton")).toHaveCount(
        2,
      )
    },
  },
  "components",
)
