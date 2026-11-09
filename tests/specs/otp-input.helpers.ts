import type { Page } from "@playwright/test"

// The verification code's slots, in the Verify form. Each one shows a
// character: as its text, or as the value of an input per slot.
function codeSlots(page: Page) {
  return page.getByRole("form", { name: "Verify" }).locator(".otp-slot")
}

// The code the slots show.
async function shownCode(page: Page) {
  return codeSlots(page).evaluateAll((slots) =>
    slots
      .map((slot) =>
        slot instanceof HTMLInputElement ? slot.value : (slot.textContent ?? "")
      )
      .join("")
  )
}

// Presses a slot where a person would. A real input may lie over the slots,
// catching the press, so the check for what's on top is skipped.
async function pressSlot(page: Page, index: number) {
  await codeSlots(page).nth(index).click({ force: true })
}

// Focuses the code by pressing its first slot.
async function focusCode(page: Page) {
  await pressSlot(page, 0)
}

// Pastes text into whatever has focus, the way the browser's paste does.
async function paste(page: Page, text: string) {
  await page.evaluate((text) => {
    const data = new DataTransfer()
    data.setData("text/plain", text)
    const event = new ClipboardEvent("paste", {
      clipboardData: data,
      bubbles: true,
      cancelable: true,
    })
    document.activeElement?.dispatchEvent(event)
  }, text)
}

export { codeSlots, focusCode, paste, pressSlot, shownCode }
