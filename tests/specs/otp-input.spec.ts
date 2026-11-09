import { expect, lastAction, test } from "../fixtures"
import { otpInputAction } from "../fixtures/otp-input"
import {
  codeSlots,
  focusCode,
  paste,
  pressSlot,
  shownCode,
} from "./otp-input.helpers"

const input = (page: import("@playwright/test").Page) =>
  page.getByRole("textbox", { name: "Verification code" })

// A one-time code, typed into slots.

test("typing fills the slots in order", async ({ page, open }) => {
  await open("otp-input")
  await focusCode(page)
  await page.keyboard.type("123")
  await expect.poll(() => shownCode(page)).toBe("123")
  expect(await lastAction(page)).toBe(
    otpInputAction.change("123", "input-change")
  )
})

test("characters the pattern doesn't accept are ignored", async ({
  page,
  open,
}) => {
  await open("otp-input")
  await focusCode(page)
  await page.keyboard.type("1a2 ")
  await expect.poll(() => shownCode(page)).toBe("12")
})

test("filling every slot completes the code", async ({ page, open }) => {
  await open("otp-input")
  await focusCode(page)
  await page.keyboard.type("123456")
  await expect.poll(() => shownCode(page)).toBe("123456")
  await expect
    .poll(() => lastAction(page))
    .toBe(otpInputAction.complete("123456"))
})

test("Backspace deletes the last character", async ({ page, open }) => {
  await open("otp-input")
  await focusCode(page)
  await page.keyboard.type("1234")
  await page.keyboard.press("Backspace")
  await expect.poll(() => shownCode(page)).toBe("123")
})

test("ArrowLeft goes back a slot, and typing replaces its character", async ({
  page,
  open,
}) => {
  await open("otp-input")
  await focusCode(page)
  await page.keyboard.type("1234")
  await page.keyboard.press("ArrowLeft")
  await page.keyboard.type("9")
  await expect.poll(() => shownCode(page)).toBe("1239")
})

test("pressing a filled slot lets you retype it", async ({ page, open }) => {
  await open("otp-input")
  await focusCode(page)
  await page.keyboard.type("123456")
  await pressSlot(page, 2)
  await page.keyboard.type("9")
  await expect.poll(() => shownCode(page)).toBe("129456")
})

test("pasting a code with a dash fills every slot", async ({
  page,
  open,
  browserName,
}) => {
  test.skip(
    browserName !== "chromium",
    "Only Chromium keeps clipboard data on synthetic paste events."
  )
  await open("otp-input")
  await focusCode(page)
  await paste(page, "123-456")
  await expect.poll(() => shownCode(page)).toBe("123456")
  await expect
    .poll(() => lastAction(page))
    .toBe(otpInputAction.complete("123456"))
})

test("the form submits the code under its name", async ({ page, open }) => {
  await open("otp-input")
  await focusCode(page)
  await page.keyboard.type("123456")
  await page.getByRole("button", { name: "Verify" }).click()
  await expect(
    page
      .getByRole("status", { name: "Submitted" })
      .or(page.locator('output[aria-label="Submitted"]'))
  ).toHaveText("123456")
})

test("a partial default code is too short to submit", async ({
  page,
  open,
}) => {
  await open("otp-input", { default: "12" })
  await page.getByRole("button", { name: "Verify" }).click()
  await expect(
    page
      .getByRole("status", { name: "Submitted" })
      .or(page.locator('output[aria-label="Submitted"]'))
  ).toHaveText("")
  expect(
    await input(page).evaluate((el) => (el as HTMLInputElement).validity.valid)
  ).toBe(false)
})

test("a typed partial code is too short, not the wrong format", async ({
  page,
  open,
}) => {
  await open("otp-input")
  await focusCode(page)
  await page.keyboard.type("1234")
  await expect.poll(() => shownCode(page)).toBe("1234")
  const validity = () =>
    input(page).evaluate((el) => {
      const { tooShort, patternMismatch } = (el as HTMLInputElement).validity
      return { tooShort, patternMismatch }
    })
  await expect
    .poll(validity)
    .toEqual({ tooShort: true, patternMismatch: false })
})

test("a canceled change keeps the code", async ({ page, open }) => {
  await open("otp-input", { cancel: "5" })
  await focusCode(page)
  await page.keyboard.type("12345")
  await expect.poll(() => shownCode(page)).toBe("1234")
})

test("a disabled code can't be typed into", async ({ page, open }) => {
  await open("otp-input", { disabled: "" })
  await codeSlots(page).first().click({ force: true })
  await page.keyboard.type("12")
  await expect.poll(() => shownCode(page)).toBe("")
})

test("a code of letters and digits takes both", async ({ page, open }) => {
  await open("otp-input")
  await page
    .locator(".otp", { hasNot: page.locator("form") })
    .last()
    .locator(".otp-slot")
    .first()
    .click({ force: true })
  await page.keyboard.type("a1-B2")
  await expect
    .poll(() =>
      page
        .locator(".otp")
        .last()
        .locator(".otp-slot")
        .evaluateAll((slots) =>
          slots
            .map((slot) =>
              slot instanceof HTMLInputElement ? slot.value : slot.textContent
            )
            .join("")
        )
    )
    .toBe("a1B2")
})

test("the input asks for a one-time code and a numeric keyboard", async ({
  page,
  open,
}) => {
  await open("otp-input")
  await expect(
    page.getByRole("textbox", { name: "Verification code" })
  ).toHaveAttribute("autocomplete", "one-time-code")
  await expect(
    page.getByRole("textbox", { name: "Verification code" })
  ).toHaveAttribute("inputmode", "numeric")
  await expect(
    page.getByRole("textbox", { name: "Verification code" })
  ).toHaveAttribute("maxlength", "6")
})

test("typing a whole code with no waits fills it", async ({ page, open }) => {
  await open("otp-input")
  await page.getByRole("textbox", { name: "Verification code" }).focus()
  await page.keyboard.type("987654", { delay: 0 })
  await expect.poll(() => shownCode(page)).toBe("987654")
})
