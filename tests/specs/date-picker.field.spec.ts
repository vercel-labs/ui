import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"
import {
  datePickerFieldFixture as f,
  datePickerFixture,
} from "../fixtures/date-picker"
import { invalidDate, validity } from "./date-picker.helpers"

// A Date Picker inside a Field joins it like any control: the field's label
// names the input, its description and errors describe it beside the format
// hint, its name is what the date submits under, and disabling the field
// disables the whole date picker.

const input = (page: Page) => page.getByRole("textbox", { name: f.label })
const trigger = (page: Page) =>
  page.getByRole("button", { name: /^Choose date/ })
const submitted = (page: Page) =>
  page.getByRole("status", { name: "Submitted" })

test("the field's label names the input, and the format hint and its description describe it", async ({
  page,
  open,
}) => {
  await open("date-picker-field")
  await expect(input(page)).toHaveAccessibleDescription(
    `MM/DD/YYYY ${f.description}`
  )
})

test("the date submits under the field's name", async ({ page, open }) => {
  await open("date-picker-field")
  await input(page).fill("10/20/2026")
  await input(page).press("Enter")
  await page.getByRole("button", { name: "Submit" }).click()
  await expect(submitted(page)).toHaveText(
    JSON.stringify([[datePickerFixture.name, "2026-10-20"]])
  )
})

test("a disabled field disables the input and the trigger", async ({
  page,
  open,
}) => {
  await open("date-picker-field", { disabled: "" })
  await expect(input(page)).toBeDisabled()
  await expect(trigger(page)).toBeDisabled()
  await expect(page.locator(".date-picker")).toHaveAttribute(
    "data-disabled",
    ""
  )
})

test("a required date left empty shows the field's error, which describes the input", async ({
  page,
  open,
}) => {
  await open("date-picker-field", { required: "" })
  await page.getByRole("button", { name: "Submit" }).click()
  const error = page.locator(".field-error")
  await expect(error).toBeVisible()
  await expect(input(page)).toHaveAttribute("aria-invalid", "true")
  await expect(input(page)).toBeFocused()
  const message = (await error.textContent()) ?? ""
  expect(message).not.toBe("")
  await expect(input(page)).toHaveAccessibleDescription(
    `MM/DD/YYYY ${f.description} ${message}`
  )
  await expect(submitted(page)).toHaveText("")
  await input(page).fill("10/20/2026")
  await input(page).press("Enter")
  await expect(error).toBeHidden()
  await expect(input(page)).not.toHaveAttribute("aria-invalid")
  // Typing renders the input again, which keeps the field's description.
  await expect(input(page)).toHaveAccessibleDescription(
    `MM/DD/YYYY ${f.description}`
  )
})

test("text that isn't a date shows the field's error until it's fixed", async ({
  page,
  open,
}) => {
  await open("date-picker-field")
  await input(page).fill("not a date")
  await input(page).press("Enter")
  await page.getByRole("button", { name: "Submit" }).click()
  const error = page.locator(".field-error")
  await expect(error).toBeVisible()
  await expect(page.locator(".field")).toHaveAttribute("data-invalid", "")
  expect(await validity(input(page))).toEqual(invalidDate)
  await expect(error).toHaveText(invalidDate.message)
  await expect(submitted(page)).toHaveText("")
  await input(page).fill("10/20/2026")
  await input(page).press("Tab")
  await expect(error).toBeHidden()
  await expect(page.locator(".field")).not.toHaveAttribute("data-invalid")
  await page.getByRole("button", { name: "Submit" }).click()
  await expect(submitted(page)).toHaveText(
    JSON.stringify([[datePickerFixture.name, "2026-10-20"]])
  )
})

test("removing a date picker whose text isn't a date leaves the field valid", async ({
  page,
  open,
}) => {
  await open("date-picker-field")
  await input(page).fill("not a date")
  await input(page).press("Tab")
  await page.getByRole("button", { name: "Submit" }).click()
  const error = page.locator(".field-error")
  await expect(error).toBeVisible()
  await page.getByRole("button", { name: "Remove date picker" }).click()
  await expect(page.locator(".date-picker")).toHaveCount(0)
  await expect(error).toBeHidden()
  await expect(page.locator(".field")).not.toHaveAttribute("data-invalid")
})
