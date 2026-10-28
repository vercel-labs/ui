import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"
import { datePickerAction, datePickerFixture as f } from "../fixtures/date-picker"
import { dateName, day, expectFocused } from "./calendar.helpers"

// A text input that reads a typed date, and a button that opens a calendar in
// a dialog, following the WAI-ARIA date picker dialog:
// https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/

const input = (page: Page, name = "Due date") => page.getByRole("textbox", { name })
const trigger = (page: Page) => page.getByRole("button", { name: /^Choose dates?/ })
const dialog = (page: Page) => page.getByRole("dialog")
const status = (page: Page) => page.getByRole("status", { name: "Last action" })
const submitted = (page: Page) => page.getByRole("status", { name: "Submitted" })

async function type(page: Page, text: string, name?: string) {
  await input(page, name).fill(text)
  await input(page, name).press("Enter")
}

test("a typed date in the page's format becomes the value on Enter, and the form submits it as ISO", async ({
  page,
  open,
}) => {
  await open("date-picker")
  await expect(input(page)).toHaveAccessibleDescription("MM/DD/YYYY")
  await type(page, "10/20/2026")
  await expect(status(page)).toHaveText(datePickerAction("value", "2026-10-20", "input-commit"))
  await input(page).fill("dec 3")
  await page.keyboard.press("Tab")
  await expect(input(page)).toHaveValue("12/03/2026")
  await page.getByRole("button", { name: "Submit" }).click()
  await expect(submitted(page)).toHaveText(JSON.stringify([[f.name, "2026-12-03"]]))
})

test("text that isn't a date stays as typed and marks the input invalid", async ({ page, open }) => {
  await open("date-picker", { value: "2026-10-16" })
  await type(page, "not a date")
  await expect(input(page)).toHaveValue("not a date")
  await expect(input(page)).toHaveAttribute("aria-invalid", "true")
  await type(page, "10/18/2026")
  await expect(input(page)).not.toHaveAttribute("aria-invalid")
})

test("text that isn't a date blocks the form's submit until it's fixed", async ({ page, open }) => {
  await open("date-picker", { value: "2026-10-16" })
  await type(page, "not a date")
  await page.getByRole("button", { name: "Submit" }).click()
  await expect(submitted(page)).toHaveText("")
  expect(await input(page).evaluate((el: HTMLInputElement) => el.validity.customError)).toBe(true)
  await type(page, "10/18/2026")
  expect(await input(page).evaluate((el: HTMLInputElement) => el.validity.customError)).toBe(false)
  await page.getByRole("button", { name: "Submit" }).click()
  await expect(submitted(page)).toHaveText(JSON.stringify([[f.name, "2026-10-18"]]))
})

test("clearing text that isn't a date lets the form submit", async ({ page, open }) => {
  await open("date-picker", { value: "2026-10-16" })
  await type(page, "not a date")
  await type(page, "")
  expect(await input(page).evaluate((el: HTMLInputElement) => el.validity.valid)).toBe(true)
  await page.getByRole("button", { name: "Submit" }).click()
  await expect(submitted(page)).toHaveText(JSON.stringify([[f.name, ""]]))
})

test("the format hint describes the input", async ({ page, open }) => {
  await open("date-picker")
  await expect(input(page)).toHaveAccessibleDescription("MM/DD/YYYY")
})

test("the trigger opens a dialog with focus on the selected date, and Escape closes it back to the trigger", async ({
  page,
  open,
}) => {
  await open("date-picker", { value: "2026-10-20" })
  await expect(trigger(page)).toHaveAccessibleName(`Choose date, ${dateName("2026-10-20")}`)
  await trigger(page).click()
  await expect(dialog(page)).toBeVisible()
  await expect(trigger(page)).toHaveAttribute("aria-expanded", "true")
  await expectFocused(page, "2026-10-20")
  await page.keyboard.press("Escape")
  await expect(dialog(page)).toBeHidden()
  await expect(trigger(page)).toBeFocused()
})

test("with nothing selected, focus goes to today", async ({ page, open }) => {
  await open("date-picker")
  await trigger(page).click()
  await expectFocused(page, f.today)
})

test("picking a day fills the input, closes the dialog and returns focus to the trigger", async ({
  page,
  open,
}) => {
  await open("date-picker")
  await trigger(page).click()
  await expectFocused(page, f.today)
  await page.keyboard.press("ArrowRight")
  await page.keyboard.press("Enter")
  await expect(dialog(page)).toBeHidden()
  await expect(input(page)).toHaveValue("10/17/2026")
  await expect(trigger(page)).toBeFocused()

  await trigger(page).click()
  await day(page, "2026-10-22").click()
  await expect(dialog(page)).toBeHidden()
  await expect(input(page)).toHaveValue("10/22/2026")
})

test("with closeOnSelect off, the dialog stays open after a pick", async ({ page, open }) => {
  await open("date-picker", { keepOpen: "" })
  await trigger(page).click()
  await day(page, "2026-10-22").click()
  await expect(input(page)).toHaveValue("10/22/2026")
  await expect(dialog(page)).toBeVisible()
})

test("Alt+ArrowDown in the input opens the calendar", async ({ page, open }) => {
  await open("date-picker")
  await input(page).focus()
  await page.keyboard.press("Alt+ArrowDown")
  await expect(dialog(page)).toBeVisible()
  await expectFocused(page, f.today)
})

test("a typed date opens the calendar on its month", async ({ page, open }) => {
  await open("date-picker")
  await type(page, "03/09/2027")
  await trigger(page).click()
  await expect(dialog(page).getByRole("heading")).toHaveText("March 2027")
  await expectFocused(page, "2027-03-09")
})

test("a press outside closes the dialog", async ({ page, open }) => {
  await open("date-picker")
  await trigger(page).click()
  await expect(dialog(page)).toBeVisible()
  await page.mouse.click(5, 5)
  await expect(dialog(page)).toBeHidden()
})

test("a preset selects its value and closes the dialog", async ({ page, open }) => {
  await open("date-picker")
  await trigger(page).click()
  await dialog(page).getByRole("button", { name: f.preset.label }).click()
  await expect(dialog(page)).toBeHidden()
  await expect(input(page)).toHaveValue("12/25/2026")
  await expect(status(page)).toHaveText(datePickerAction("open", false, "preset-press"))
})

test("Clear empties the value and focuses the input", async ({ page, open }) => {
  await open("date-picker", { value: "2026-10-20" })
  await page.getByRole("button", { name: "Clear" }).click()
  await expect(input(page)).toHaveValue("")
  await expect(input(page)).toBeFocused()
  await expect(status(page)).toHaveText(datePickerAction("value", null, "clear-press"))
})

test("a form reset puts the default value back", async ({ page, open }) => {
  await open("date-picker", { value: "2026-10-20" })
  await type(page, "11/01/2026")
  await page.getByRole("button", { name: "Reset" }).click()
  await expect(input(page)).toHaveValue("10/20/2026")
  await page.getByRole("button", { name: "Submit" }).click()
  await expect(submitted(page)).toHaveText(JSON.stringify([[f.name, "2026-10-20"]]))
})

test("a required date picker blocks an empty submit", async ({ page, open }) => {
  await open("date-picker", { required: "" })
  await page.getByRole("button", { name: "Submit" }).click()
  await expect(submitted(page)).toHaveText("")
  await expect(input(page)).toBeFocused()
})

test("days past min and max can't be typed or picked", async ({ page, open }) => {
  await open("date-picker", { min: "2026-10-10", max: "2026-10-25" })
  await type(page, "10/26/2026")
  await expect(input(page)).toHaveAttribute("aria-invalid", "true")
  await trigger(page).click()
  await expect(day(page, "2026-10-26")).toHaveAttribute("aria-disabled", "true")
})

test("German reads and writes dates day first", async ({ page, open }) => {
  await open("date-picker", { lang: "de" })
  await expect(input(page)).toHaveAccessibleDescription("TT.MM.JJJJ")
  await type(page, "3.12.2026")
  await expect(input(page)).toHaveValue("03.12.2026")
})

test.describe("range", () => {
  test("picking a start and an end fills both inputs and closes after the end", async ({ page, open }) => {
    await open("date-picker", { mode: "range" })
    await trigger(page).click()
    await day(page, "2026-10-12").click()
    await expect(input(page, "Start date")).toHaveValue("10/12/2026")
    await expect(dialog(page)).toBeVisible()
    await day(page, "2026-10-15").click()
    await expect(dialog(page)).toBeHidden()
    await expect(input(page, "End date")).toHaveValue("10/15/2026")
    await expect(status(page)).toHaveText(datePickerAction("open", false, "item-press"))
    await page.getByRole("button", { name: "Submit" }).click()
    await expect(submitted(page)).toHaveText(
      JSON.stringify([
        ["start", "2026-10-12"],
        ["end", "2026-10-15"],
      ]),
    )
  })

  test("each end can be typed, and the value changes once both are set", async ({ page, open }) => {
    await open("date-picker", { mode: "range" })
    await type(page, "10/20/2026", "Start date")
    await expect(status(page)).toHaveText("")
    await type(page, "10/23/2026", "End date")
    await expect(status(page)).toHaveText(
      datePickerAction("value", ["2026-10-20", "2026-10-23"], "input-commit"),
    )
  })

  test("an end before the start is invalid", async ({ page, open }) => {
    await open("date-picker", { mode: "range", value: "2026-10-20,2026-10-23" })
    await type(page, "10/10/2026", "End date")
    await expect(input(page, "End date")).toHaveAttribute("aria-invalid", "true")
  })

  test("an end that isn't a date blocks the form's submit until it's fixed", async ({ page, open }) => {
    await open("date-picker", { mode: "range", value: "2026-10-20,2026-10-23" })
    await type(page, "not a date", "End date")
    await page.getByRole("button", { name: "Submit" }).click()
    await expect(submitted(page)).toHaveText("")
    const endError = () => input(page, "End date").evaluate((el: HTMLInputElement) => el.validity.customError)
    expect(await endError()).toBe(true)
    expect(await input(page, "Start date").evaluate((el: HTMLInputElement) => el.validity.valid)).toBe(true)
    await type(page, "10/25/2026", "End date")
    expect(await endError()).toBe(false)
    await page.getByRole("button", { name: "Submit" }).click()
    await expect(submitted(page)).toHaveText(
      JSON.stringify([
        ["start", "2026-10-20"],
        ["end", "2026-10-25"],
      ]),
    )
  })
})
