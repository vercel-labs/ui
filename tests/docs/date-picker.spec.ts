import { expect, type Locator } from "@playwright/test"
import { testExamples, type Check } from "./docs-helpers"

const input = (preview: Locator, name = "Due date") => preview.getByRole("textbox", { name, exact: true })
const trigger = (preview: Locator) => preview.getByRole("button", { name: /^Choose dates?/ })
// The popup renders outside the preview, at the end of the page.
const dialog = (preview: Locator) => preview.page().getByRole("dialog")
const day = (preview: Locator, name: string) => dialog(preview).getByRole("gridcell", { name, exact: true })

async function type(preview: Locator, text: string, name?: string) {
  await input(preview, name).fill(text)
  await input(preview, name).press("Enter")
}

// Escape closes the popup, which is gone once it animates out.
async function close(preview: Locator) {
  await preview.page().keyboard.press("Escape")
  await expect(dialog(preview)).toBeHidden()
}

// The last line an example logged to its console.
function lastLog(preview: Locator) {
  return preview
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()
}

// Checks whether the field says it's invalid.
async function expectInvalid(preview: Locator, invalid: boolean, name?: string) {
  if (invalid) await expect(input(preview, name)).toHaveAttribute("aria-invalid", "true")
  else await expect(input(preview, name)).not.toHaveAttribute("aria-invalid")
}

// Opens the calendar, presses a day and checks the popup closed.
async function pick(preview: Locator, name: string) {
  await trigger(preview).click()
  await day(preview, name).click()
  await expect(dialog(preview)).toBeHidden()
}

// Each example's check, in the order they appear on the Date Picker page.
const checks: Record<string, Check> = {
  basic: async (preview) => {
    await expect(input(preview)).toHaveValue("10/16/2026")
    await expect(input(preview)).toHaveAccessibleDescription("MM/DD/YYYY")
    await pick(preview, "Tuesday, October 20, 2026")
    await expect(input(preview)).toHaveValue("10/20/2026")
    await type(preview, "dec 3 2026")
    await expect(input(preview)).toHaveValue("12/03/2026")
  },
  invalid: async (preview) => {
    await expect(preview.getByText(/Like 12\/31\/\d{4}/)).toBeVisible()
    await type(preview, "not a date")
    await expectInvalid(preview, true)
    await expect(input(preview)).toHaveAttribute("data-invalid", "")
    await type(preview, "10/18/2026")
    await expectInvalid(preview, false)
  },
  range: async (preview) => {
    await trigger(preview).click()
    await day(preview, "Tuesday, October 20, 2026").click()
    // The calendar stays open for the end.
    await expect(dialog(preview)).toBeVisible()
    await expect(input(preview, "Check in")).toHaveValue("10/20/2026")
    await day(preview, "Friday, October 23, 2026").click()
    await expect(dialog(preview)).toBeHidden()
    await expect(input(preview, "Check out")).toHaveValue("10/23/2026")
  },
  presets: async (preview) => {
    await trigger(preview).click()
    await dialog(preview).getByRole("button", { name: "Last 7 Days" }).click()
    await expect(dialog(preview)).toBeHidden()
    await expect(input(preview, "Check in")).toHaveValue("10/10/2026")
    await expect(input(preview, "Check out")).toHaveValue("10/16/2026")
    await trigger(preview).click()
    await expect(dialog(preview).getByRole("button", { name: "Last 7 Days" })).toHaveAttribute(
      "aria-pressed",
      "true",
    )
    await close(preview)
  },
  "min-max": async (preview) => {
    await type(preview, "11/21/2026", "Delivery date")
    await expectInvalid(preview, true, "Delivery date")
    await type(preview, "10/17/2026", "Delivery date")
    await expectInvalid(preview, true, "Delivery date")
    await type(preview, "10/19/2026", "Delivery date")
    await expectInvalid(preview, false, "Delivery date")
    await trigger(preview).click()
    await expect(day(preview, "Sunday, October 4, 2026")).toHaveAttribute("aria-disabled", "true")
    await expect(day(preview, "Saturday, October 24, 2026")).toHaveAttribute("aria-disabled", "true")
    await expect(day(preview, "Monday, October 5, 2026")).not.toHaveAttribute("aria-disabled", "true")
    await close(preview)
  },
  locale: async (preview) => {
    await expect(input(preview, "Fälligkeitsdatum")).toHaveValue("16.10.2026")
    await expect(input(preview, "Fälligkeitsdatum")).toHaveAccessibleDescription("TT.MM.JJJJ")
    await type(preview, "3.12.2026", "Fälligkeitsdatum")
    await expect(input(preview, "Fälligkeitsdatum")).toHaveValue("03.12.2026")
  },
  clear: async (preview) => {
    await preview.getByRole("button", { name: "Clear" }).click()
    await expect(input(preview)).toHaveValue("")
    await expect(input(preview)).toBeFocused()
  },
  dismissible: async (preview) => {
    await trigger(preview).click()
    await day(preview, "Tuesday, October 20, 2026").click()
    // Until the stay has both ends, a press outside is refused and says what's missing.
    await preview.page().mouse.click(5, 5)
    await expect(dialog(preview).getByRole("alert")).toBeVisible()
    await day(preview, "Friday, October 23, 2026").click()
    await expect(dialog(preview)).toBeHidden()
    await expect(input(preview, "Check out")).toHaveValue("10/23/2026")
    await trigger(preview).click()
    await close(preview)
  },
  popup: async (preview) => {
    // Room below the field, so the popup doesn't flip above it.
    await input(preview).evaluate((el) => {
      el.scrollIntoView({ block: "start" })
      window.scrollBy(0, -160)
    })
    await trigger(preview).click()
    await expect(dialog(preview)).toBeVisible()
    await expect(lastLog(preview)).toHaveText("Opened (trigger-press)")
    // It opens below the field by default, in the example's own container where there is one.
    await expect(preview.getByRole("dialog")).toBeVisible()
    const field = (await input(preview).boundingBox())!
    expect((await dialog(preview).boundingBox())!.y).toBeGreaterThanOrEqual(field.y + field.height)
    await close(preview)
    await expect(lastLog(preview)).toHaveText("Finished closing")
  },
  form: async (preview) => {
    // Required blocks an empty submit and shows the field's error.
    await preview.getByRole("button", { name: "Submit" }).click()
    await expect(preview.getByText("Choose a due date.")).toBeVisible()
    await expect(input(preview)).toHaveAccessibleDescription(/When the invoice is due\./)
    await type(preview, "10/20/2026")
    await preview.getByRole("button", { name: "Submit" }).click()
    await expect(lastLog(preview)).toHaveText("Submitted due=2026-10-20")
  },
  controlled: async (preview) => {
    await type(preview, "10/20/2026")
    await expect(lastLog(preview)).toHaveText(/^2026-10-20 \(/)
  },
  controller: async (preview) => {
    await preview.getByRole("button", { name: "Choose Christmas" }).click()
    await expect(input(preview)).toHaveValue("12/25/2026")
  },
}

testExamples("date-picker", checks, "components", Object.keys(checks))
