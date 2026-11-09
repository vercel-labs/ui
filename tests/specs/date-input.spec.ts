import { expect, lastAction, test } from "../fixtures"
import { dateInputAction, dateInputFixture } from "../fixtures/date-input"
import { group, paste, segment, shown } from "./date-input.helpers"

const submitted = (page: import("@playwright/test").Page) =>
  page.locator('output[aria-label="Submitted"]')

// A date or a time, typed and stepped one segment at a time.

test("each unit is a spinbutton in the locale's order", async ({
  page,
  open,
}) => {
  await open("date-input", { date: "2026-11-02" })
  await expect(group(page).getByRole("spinbutton")).toHaveCount(3)
  expect(await shown(page)).toBe("11/02/2026")
  await expect(segment(page, "month")).toHaveAttribute("aria-valuenow", "11")
  await expect(segment(page, "month")).toHaveAttribute("aria-valuemax", "12")
})

test("another locale orders the segments its own way", async ({
  page,
  open,
}) => {
  await open("date-input", { date: "2026-11-02", locale: "en-GB" })
  expect(await shown(page)).toBe("02/11/2026")
})

test("typing fills each segment, moves on and reports the date once", async ({
  page,
  open,
}) => {
  await open("date-input")
  await segment(page, "month").click()
  await page.keyboard.type("11042026")
  expect(await shown(page)).toBe("11/04/2026")
  await expect
    .poll(() => lastAction(page))
    .toBe(dateInputAction.change("date", "2026-11-04", "input-change"))
})

test("a press on the box or between segments focuses the nearest segment", async ({
  page,
  open,
}) => {
  await open("date-input", { date: "2026-11-02" })
  const box = (await group(page).boundingBox())!
  await page.mouse.click(box.x + 2, box.y + box.height / 2)
  await expect(segment(page, "month")).toBeFocused()
  const day = (await segment(page, "day").boundingBox())!
  await page.mouse.click(day.x + day.width / 2, box.y + 1)
  await expect(segment(page, "day")).toBeFocused()
  await page.mouse.click(box.x + box.width - 2, box.y + box.height / 2)
  await expect(segment(page, "year")).toBeFocused()
})

test("a digit that can't start a longer number moves on at once", async ({
  page,
  open,
}) => {
  await open("date-input")
  await segment(page, "month").click()
  await page.keyboard.type("4")
  await expect(segment(page, "day")).toBeFocused()
  await expect(segment(page, "month")).toHaveValue("04")
})

test("a separator moves to the next segment", async ({ page, open }) => {
  await open("date-input")
  await segment(page, "month").click()
  await page.keyboard.type("1/")
  await expect(segment(page, "day")).toBeFocused()
  await expect(segment(page, "month")).toHaveValue("01")
})

test("typing with separators over a filled date or time keeps every segment", async ({
  page,
  open,
}) => {
  await open("date-input", { date: "2026-11-02", time: "09:30" })
  await segment(page, "month").click()
  await page.keyboard.type("12/25/2027")
  expect(await shown(page)).toBe("12/25/2027")
  await segment(page, "hour", "time").click()
  await page.keyboard.type("2:45p")
  expect(await shown(page, "time")).toBe("02:45 PM")
  await expect
    .poll(() => lastAction(page))
    .toBe(dateInputAction.change("time", "14:45", "input-change"))
})

test("ArrowUp and ArrowDown step a segment and wrap around", async ({
  page,
  open,
}) => {
  await open("date-input", { date: "2026-12-02" })
  await segment(page, "month").click()
  await page.keyboard.press("ArrowUp")
  expect(await shown(page)).toBe("01/02/2026")
  await page.keyboard.press("ArrowDown")
  expect(await shown(page)).toBe("12/02/2026")
  expect(await lastAction(page)).toBe(
    dateInputAction.change("date", "2026-12-02", "step-key")
  )
})

test("PageUp and PageDown take bigger steps", async ({ page, open }) => {
  await open("date-input", { date: "2026-01-02" })
  await segment(page, "month").click()
  await page.keyboard.press("PageUp")
  await expect(segment(page, "month")).toHaveValue("04")
  await segment(page, "year").click()
  await page.keyboard.press("PageDown")
  await expect(segment(page, "year")).toHaveValue("2021")
})

test("Home and End go to a segment's first and last values", async ({
  page,
  open,
}) => {
  await open("date-input", { date: "2026-02-10" })
  await segment(page, "day").click()
  await page.keyboard.press("End")
  await expect(segment(page, "day")).toHaveValue("28")
  await page.keyboard.press("Home")
  await expect(segment(page, "day")).toHaveValue("01")
})

test("ArrowLeft and ArrowRight move between segments", async ({
  page,
  open,
}) => {
  await open("date-input", { date: "2026-11-02" })
  await segment(page, "month").click()
  await page.keyboard.press("ArrowRight")
  await expect(segment(page, "day")).toBeFocused()
  await page.keyboard.press("ArrowLeft")
  await expect(segment(page, "month")).toBeFocused()
})

test("Tab moves through the segments, then out", async ({ page, open }) => {
  await open("date-input")
  await page.getByRole("button", { name: "Before" }).focus()
  await page.keyboard.press("Tab")
  await expect(segment(page, "month")).toBeFocused()
  await page.keyboard.press("Tab")
  await expect(segment(page, "day")).toBeFocused()
  await page.keyboard.press("Tab")
  await expect(segment(page, "year")).toBeFocused()
  await page.keyboard.press("Tab")
  await expect(segment(page, "hour", "time")).toBeFocused()
})

test("Backspace empties a segment, then moves back", async ({ page, open }) => {
  await open("date-input", { date: "2026-11-02" })
  await segment(page, "day").click()
  await page.keyboard.press("Backspace")
  await expect(segment(page, "day")).toHaveValue("")
  await expect
    .poll(() => lastAction(page))
    .toBe(dateInputAction.change("date", null, "input-change"))
  await page.keyboard.press("Backspace")
  await expect(segment(page, "month")).toBeFocused()
})

test("a day past the end of a new month is moved back to its last day", async ({
  page,
  open,
}) => {
  await open("date-input", { date: "2026-01-31" })
  await segment(page, "month").click()
  await page.keyboard.press("ArrowUp")
  expect(await shown(page)).toBe("02/28/2026")
})

test("pasting a date fills every segment", async ({
  page,
  open,
  browserName,
}) => {
  test.skip(
    browserName !== "chromium",
    "Only Chromium keeps clipboard data on synthetic paste events."
  )
  await open("date-input")
  await segment(page, "month").click()
  await paste(page, "2026-07-14")
  expect(await shown(page)).toBe("07/14/2026")
  await expect
    .poll(() => lastAction(page))
    .toBe(dateInputAction.change("date", "2026-07-14", "paste"))
})

test("a time takes hours, minutes and AM or PM", async ({ page, open }) => {
  await open("date-input")
  await segment(page, "hour", "time").click()
  await page.keyboard.type("230p")
  expect(await shown(page, "time")).toBe("02:30 PM")
  await expect
    .poll(() => lastAction(page))
    .toBe(dateInputAction.change("time", "14:30", "input-change"))
})

test("a 24-hour clock has no AM or PM", async ({ page, open }) => {
  await open("date-input", { "hour-cycle": "24", time: "14:30" })
  expect(await shown(page, "time")).toBe("14:30")
  await expect(group(page, "time").getByRole("spinbutton")).toHaveCount(2)
})

test("a date with a time shows its hour and minute too", async ({
  page,
  open,
}) => {
  await open("date-input", { granularity: "minute", date: "2026-11-02T09:05" })
  await expect(segment(page, "hour")).toHaveValue("09")
  await expect(segment(page, "minute")).toHaveValue("05")
})

test("a controller sets and clears the date", async ({ page, open }) => {
  await open("date-input")
  await page.getByRole("button", { name: "Set date" }).click()
  expect(await shown(page)).toBe("12/25/2026")
  expect(await lastAction(page)).toBe(
    dateInputAction.change("date", dateInputFixture.filled, "imperative")
  )
  await page.getByRole("button", { name: "Clear date" }).click()
  await expect(segment(page, "month")).toHaveValue("")
})

test("a canceled change keeps the date", async ({ page, open }) => {
  await open("date-input", { cancel: "2026-12-25" })
  await page.getByRole("button", { name: "Set date" }).click()
  await expect(segment(page, "month")).toHaveValue("")
})

test("the form submits the ISO date and time under their names", async ({
  page,
  open,
}) => {
  await open("date-input", { date: "2026-11-02", time: "09:30" })
  await page.getByRole("button", { name: "Save" }).click()
  await expect(submitted(page)).toHaveText(
    JSON.stringify([
      ["start", "2026-11-02"],
      ["time", "09:30"],
    ])
  )
})

test("Enter submits the form with what was typed", async ({ page, open }) => {
  await open("date-input", { date: "2026-11-02", time: "09:30" })
  await segment(page, "minute", "time").click()
  await page.keyboard.type("4")
  await page.keyboard.press("Enter")
  await expect(submitted(page)).toHaveText(
    JSON.stringify([
      ["start", "2026-11-02"],
      ["time", "09:04"],
    ])
  )
})

test("resetting the form brings back the default date", async ({
  page,
  open,
}) => {
  await open("date-input", { date: "2026-11-02" })
  await segment(page, "month").click()
  await page.keyboard.press("ArrowUp")
  await page.getByRole("button", { name: "Reset" }).click()
  await expect.poll(() => shown(page)).toBe("11/02/2026")
})

test("a partly filled date can't be submitted", async ({ page, open }) => {
  await open("date-input")
  await segment(page, "month").click()
  await page.keyboard.type("11")
  await page.getByRole("button", { name: "Save" }).click()
  await expect(submitted(page)).toHaveText("")
  await expect(segment(page, "month")).toBeFocused()
})

test("a required empty date can't be submitted", async ({ page, open }) => {
  await open("date-input", { required: "" })
  await page.getByRole("button", { name: "Save" }).click()
  await expect(submitted(page)).toHaveText("")
})

test("a date after max is invalid", async ({ page, open }) => {
  await open("date-input", { date: "2026-11-02", max: "2026-11-30" })
  await expect(segment(page, "month")).not.toHaveAttribute("aria-invalid")
  await segment(page, "month").click()
  await page.keyboard.press("ArrowUp")
  await expect(segment(page, "month")).toHaveAttribute("aria-invalid", "true")
  await expect(group(page)).toHaveAttribute("data-invalid", "")
})

test("an unavailable date is invalid", async ({ page, open }) => {
  await open("date-input", { date: "2026-11-02", weekdays: "" })
  await expect(group(page)).not.toHaveAttribute("data-invalid")
  await segment(page, "day").click()
  await page.keyboard.press("ArrowDown")
  await expect(group(page)).toHaveAttribute("data-invalid", "")
})

test("the field's label focuses the first segment", async ({ page, open }) => {
  await open("date-input")
  await page.getByText(dateInputFixture.date.label, { exact: true }).click()
  await expect(segment(page, "month")).toBeFocused()
})

test("a read-only date takes focus but doesn't change", async ({
  page,
  open,
}) => {
  await open("date-input", { date: "2026-11-02", readonly: "" })
  await segment(page, "month").click()
  await page.keyboard.press("ArrowUp")
  await page.keyboard.type("4")
  expect(await shown(page)).toBe("11/02/2026")
})

test("a disabled date can't be focused", async ({ page, open }) => {
  await open("date-input", { disabled: "" })
  await expect(segment(page, "month")).toBeDisabled()
  await expect(group(page)).toHaveAttribute("data-disabled", "")
})
