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

test("correcting a middle character keeps the others in their slots @enhancement", async ({
  page,
  open,
}) => {
  await open("otp-input")
  await focusCode(page)
  await page.keyboard.type("123456")
  await pressSlot(page, 2)
  await page.keyboard.press("Backspace")
  await page.keyboard.type("9")
  await expect.poll(() => shownCode(page)).toBe("129456")
})

test("an incomplete code stops the form, and typing carries on @enhancement", async ({
  page,
  open,
}) => {
  await open("otp-input")
  await focusCode(page)
  await page.keyboard.type("12")
  await page.keyboard.press("Enter")
  await expect(page.locator('output[aria-label="Submitted"]')).toHaveText("")
  await page.keyboard.type("3456")
  await expect.poll(() => shownCode(page)).toBe("123456")
})

test("full-width digits from an input method become digits @enhancement", async ({
  page,
  open,
}) => {
  await open("otp-input")
  await focusCode(page)
  await page.keyboard.insertText("１２３")
  await expect.poll(() => shownCode(page)).toBe("123")
})

test("undo after a paste brings back the code before it @enhancement", async ({
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
  await page.keyboard.type("12")
  await paste(page, "654321")
  await expect.poll(() => shownCode(page)).toBe("654321")
  await page.keyboard.press("ControlOrMeta+z")
  await expect.poll(() => shownCode(page)).toBe("12")
  expect(await lastAction(page)).toBe(otpInputAction.change("12", "undo"))
})

test("the code is one textbox, so screen readers read it as one field @enhancement", async ({
  page,
  open,
}) => {
  await open("otp-input")
  await expect(page.getByRole("form", { name: "Verify" })).toMatchAriaSnapshot(`
    - form "Verify":
      - textbox "Verification code"
      - button "Verify"
      - button "Reset"
  `)
})

test("the slot where typing goes is active, and draws a caret while empty @enhancement", async ({
  page,
  open,
}) => {
  await open("otp-input")
  await focusCode(page)
  await page.keyboard.type("12")
  await expect(codeSlots(page).nth(2)).toHaveAttribute("data-active", "")
  await expect(codeSlots(page).nth(2)).toHaveAttribute("data-fake-caret", "")
  await expect(codeSlots(page).nth(1)).not.toHaveAttribute("data-active")
  await page.keyboard.press("ArrowLeft")
  await expect(codeSlots(page).nth(1)).toHaveAttribute("data-active", "")
  await expect(codeSlots(page).nth(1)).not.toHaveAttribute("data-fake-caret")
  await input(page).blur()
  await expect(page.locator(".otp-slot[data-active]")).toHaveCount(0)
})

test("a password manager's badge is pushed past the last slot @enhancement", async ({
  page,
  open,
}) => {
  await open("otp-input")
  await page.evaluate(() => {
    const badge = document.createElement("div")
    badge.setAttribute("data-lastpass-icon-root", "")
    document.body.append(badge)
  })
  await focusCode(page)
  const root = page.getByRole("form", { name: "Verify" }).locator(".otp")
  const width = (await root.boundingBox())!.width
  await expect
    .poll(async () => (await input(page).boundingBox())!.width)
    .toBeCloseTo(width + 40, 0)
})

test("a form reset returns to the default code @enhancement", async ({
  page,
  open,
}) => {
  await open("otp-input", { default: "123" })
  await expect.poll(() => shownCode(page)).toBe("123")
  await focusCode(page)
  await page.keyboard.type("45")
  await page.getByRole("button", { name: "Reset" }).click()
  await expect.poll(() => shownCode(page)).toBe("123")
})

test("a controller fills the code and completes it @enhancement", async ({
  page,
  open,
}) => {
  await open("otp-input")
  await page.getByRole("button", { name: "Fill code" }).click()
  await expect.poll(() => shownCode(page)).toBe("654321")
  await expect
    .poll(() => lastAction(page))
    .toBe(otpInputAction.complete("654321"))
  await page.getByRole("button", { name: "Clear code" }).click()
  await expect.poll(() => shownCode(page)).toBe("")
})
