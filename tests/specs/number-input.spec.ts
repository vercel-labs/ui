import { countFormEvents, expect, formEventCounts, test } from "../fixtures"
import { amount, button, quantity, save, status } from "./number-input.helpers"

// Keys follow the WAI-ARIA spinbutton pattern:
// https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/

test.describe("keyboard", () => {
  test.beforeEach(async ({ open }) => {
    await open("number-input")
  })

  test("starts with its default value, formatted", async ({ page }) => {
    await expect(quantity(page)).toHaveValue("1")
    await expect(amount(page)).toHaveValue("$1,234.50")
  })

  test("ArrowUp and ArrowDown step the value", async ({ page }) => {
    await quantity(page).focus()
    await page.keyboard.press("ArrowUp")
    await expect(quantity(page)).toHaveValue("2")
    await page.keyboard.press("ArrowUp")
    await page.keyboard.press("ArrowDown")
    await expect(quantity(page)).toHaveValue("2")
    expect(await status(page, "Last action")).toBe("quantity:2")
  })

  test("Shift with an arrow key steps by the large step", async ({ page }) => {
    await quantity(page).focus()
    await page.keyboard.press("Shift+ArrowUp")
    await expect(quantity(page)).toHaveValue("11")
  })

  test("Home and End go to the minimum and the maximum", async ({ page }) => {
    await quantity(page).focus()
    await page.keyboard.press("End")
    await expect(quantity(page)).toHaveValue("99")
    await page.keyboard.press("Home")
    await expect(quantity(page)).toHaveValue("1")
  })

  test("stepping stops at the bounds", async ({ page }) => {
    await quantity(page).focus()
    await page.keyboard.press("ArrowDown")
    await expect(quantity(page)).toHaveValue("1")
  })

  test("steps keep cents exact", async ({ page }) => {
    await amount(page).focus()
    await page.keyboard.press("ArrowUp")
    await page.keyboard.press("ArrowUp")
    await page.keyboard.press("ArrowUp")
    await expect(amount(page)).toHaveValue("$1,234.53")
  })

  test("the buttons aren't in the tab order", async ({ page, tab }) => {
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(quantity(page)).toBeFocused()
    await tab()
    await expect(amount(page)).toBeFocused()
  })
})

test.describe("typing", () => {
  test.beforeEach(async ({ open }) => {
    await open("number-input")
  })

  test("typing a number changes the value", async ({ page }) => {
    await quantity(page).fill("42")
    await expect.poll(() => status(page, "Last action")).toBe("quantity:42")
  })

  test("a typed value above the maximum is lowered when focus leaves", async ({ page }) => {
    await quantity(page).fill("150")
    await amount(page).focus()
    await expect(quantity(page)).toHaveValue("99")
  })

  test("typed text in the format is read and formatted when focus leaves", async ({ page }) => {
    await amount(page).fill("$2,000")
    await quantity(page).focus()
    await expect(amount(page)).toHaveValue("$2,000.00")
    await save(page)
    await expect.poll(() => status(page, "Submitted")).toBe("quantity=1&amount=2000")
  })

  test("typing sends change only once the text is committed", async ({ page }) => {
    await countFormEvents(page)
    await quantity(page).fill("42")
    await expect.poll(() => status(page, "Last action")).toBe("quantity:42")
    expect((await formEventCounts(page)).change).toBe(0)
    await page.keyboard.press("Enter")
    await expect.poll(async () => (await formEventCounts(page)).change).toBeGreaterThan(0)
  })

  test("letters can't be typed", async ({ page }) => {
    await quantity(page).click()
    await page.keyboard.type("a")
    await expect(quantity(page)).toHaveValue("1")
  })

  test("arrow keys step from what's typed", async ({ page }) => {
    await quantity(page).fill("7")
    await page.keyboard.press("ArrowUp")
    await expect(quantity(page)).toHaveValue("8")
  })

  test("text that isn't a number goes back to the value when focus leaves", async ({ page, open }) => {
    await open("number-input", { negative: "" })
    await amount(page).fill("-")
    await quantity(page).focus()
    await expect(amount(page)).toHaveValue("$1,234.50")
  })

  test("the value commits when focus leaves", async ({ page }) => {
    await quantity(page).fill("5")
    expect(await status(page, "Committed")).toBe("")
    await amount(page).focus()
    await expect.poll(() => status(page, "Committed")).toBe("quantity:5")
  })
})

test.describe("buttons", () => {
  // Fake timers, so the check that a released button stops repeating runs the time ahead.
  test.beforeEach(async ({ page, open }) => {
    await page.clock.install()
    await open("number-input")
  })

  test("the increment and decrement buttons step the value", async ({ page }) => {
    await button(page, "Increase quantity").click()
    await expect(quantity(page)).toHaveValue("2")
    await button(page, "Increase quantity").click()
    await button(page, "Decrease quantity").click()
    await expect(quantity(page)).toHaveValue("2")
    await expect.poll(() => status(page, "Last action")).toBe("quantity:2")
  })

  test("a button at its bound is disabled and marked data-at-bound", async ({ page }) => {
    await expect(button(page, "Decrease quantity")).toBeDisabled()
    await expect(button(page, "Decrease quantity")).toHaveAttribute("data-at-bound", "")
    await expect(button(page, "Increase quantity")).toBeEnabled()
    await expect(button(page, "Increase quantity")).not.toHaveAttribute("data-at-bound")
  })

  test("holding a button repeats the step", async ({ page }) => {
    const box = (await button(page, "Increase quantity").boundingBox())!
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.down()
    await expect.poll(async () => Number(await quantity(page).inputValue())).toBeGreaterThan(4)
    await page.mouse.up()
    const settled = await quantity(page).inputValue()
    await page.clock.runFor(200)
    await expect(quantity(page)).toHaveValue(settled)
  })

  test("a press commits when the button is released", async ({ page }) => {
    await button(page, "Increase quantity").click()
    await expect.poll(() => status(page, "Committed")).toBe("quantity:2")
  })

  test("a disabled button is marked disabled", async ({ page, open }) => {
    await open("number-input", { quantity: "5", "disabled-increment": "" })
    const increment = button(page, "Increase quantity")
    await expect(increment).toBeDisabled()
    await expect(increment).toHaveAttribute("aria-disabled", "true")
    await expect(increment).toHaveAttribute("data-disabled", "")
    await expect(button(page, "Decrease quantity")).toBeEnabled()
  })

  test("a disabled button doesn't step when clicked or held, and the other still does", async ({
    page,
    open,
  }) => {
    await open("number-input", { quantity: "5", "disabled-increment": "" })
    const increment = button(page, "Increase quantity")
    await increment.click({ force: true })
    // Presses that reach the button anyway, like a pointer on a custom element
    // or a screen reader's click, must not step either.
    await increment.dispatchEvent("pointerdown", { button: 0, pointerType: "mouse", isPrimary: true })
    await page.clock.runFor(1000)
    await increment.dispatchEvent("pointerup", { button: 0, pointerType: "mouse", isPrimary: true })
    await increment.dispatchEvent("click", { detail: 0 })
    const box = (await increment.boundingBox())!
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.down()
    await page.clock.runFor(1000)
    await page.mouse.up()
    await expect(quantity(page)).toHaveValue("5")
    await expect.poll(() => status(page, "Last action")).toBe("")
    await button(page, "Decrease quantity").click()
    await expect(quantity(page)).toHaveValue("4")
  })

  test("a button disabled while it's held stops repeating", async ({ page, open, framework }) => {
    await open("number-input", { quantity: "5" })
    const increment = button(page, "Increase quantity")
    const box = (await increment.boundingBox())!
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.down()
    await expect(quantity(page)).toHaveValue("6")
    await increment.evaluate(
      (el, web) => (web ? el.closest("ui-number-input-increment")! : el).setAttribute("disabled", ""),
      framework.startsWith("web"),
    )
    await page.clock.runFor(1000)
    await page.mouse.up()
    await expect(quantity(page)).toHaveValue("6")
  })
})

test.describe("state and forms", () => {
  test("submits the number as is, not formatted", async ({ page, open }) => {
    await open("number-input")
    await save(page)
    await expect.poll(() => status(page, "Submitted")).toBe("quantity=1&amount=1234.5")
  })

  test("a disabled field can't be focused or changed", async ({ page, open }) => {
    await open("number-input", { disabled: "" })
    await expect(quantity(page)).toBeDisabled()
    await expect(button(page, "Increase quantity")).toBeDisabled()
  })

  test("a read-only field can be focused, but not changed", async ({ page, open }) => {
    await open("number-input", { readonly: "" })
    await quantity(page).focus()
    await page.keyboard.press("ArrowUp")
    await expect(quantity(page)).toHaveValue("1")
    await expect(quantity(page)).toHaveAttribute("readonly", "")
  })

  test("a required empty field blocks the form", async ({ page, open }) => {
    await open("number-input", { quantity: "", required: "" })
    await save(page)
    expect(await status(page, "Submitted")).toBe("")
    expect(await quantity(page).evaluate((el) => (el as HTMLInputElement).validity.valueMissing)).toBe(true)
  })

  test("the mouse wheel does nothing unless turned on", async ({ page, open }) => {
    await page.clock.install()
    await open("number-input")
    await quantity(page).focus()
    await quantity(page).hover()
    await page.mouse.wheel(0, -100)
    await page.clock.runFor(100)
    await expect(quantity(page)).toHaveValue("1")
  })

  test("the mouse wheel steps a focused field when turned on", async ({ page, open }) => {
    await open("number-input", { wheel: "" })
    await quantity(page).focus()
    await quantity(page).hover()
    await page.mouse.wheel(0, -100)
    await expect(quantity(page)).toHaveValue("2")
    await page.mouse.wheel(0, 100)
    await expect(quantity(page)).toHaveValue("1")
  })

  test("a canceled change keeps the value", async ({ page, open }) => {
    await open("number-input", { cancel: "quantity" })
    await quantity(page).focus()
    await page.keyboard.press("ArrowUp")
    await expect(quantity(page)).toHaveValue("1")
  })

  test("a controlled field follows its value", async ({ page, open }) => {
    await open("number-input", { controlled: "" })
    await button(page, "Increase quantity").click()
    await expect(quantity(page)).toHaveValue("2")
  })

  test("reads and writes the locale's format", async ({ page, open }) => {
    await open("number-input", { locale: "de-DE" })
    await expect(amount(page)).toHaveValue(/^1\.234,50\s\$$/)
    await amount(page).fill("2.000,25")
    await quantity(page).focus()
    await expect(amount(page)).toHaveValue(/^2\.000,25\s\$$/)
  })
})
