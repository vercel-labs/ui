import { expect, test } from "../fixtures"
import {
  amount,
  button,
  quantity,
  save,
  scrubArea,
  standInPointerLock,
  status,
} from "./number-input.helpers"

// Behavior past the WAI-ARIA pattern, tagged `@enhancement`.

test(
  "Page Up and Page Down step by the large step",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("number-input")
    await quantity(page).focus()
    await page.keyboard.press("PageUp")
    await expect(quantity(page)).toHaveValue("11")
    await page.keyboard.press("PageDown")
    await expect(quantity(page)).toHaveValue("1")
  }
)

test(
  "a form reset returns every field to its default",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("number-input")
    await button(page, "Increase quantity").click()
    await amount(page).fill("5")
    await quantity(page).focus()
    await expect(quantity(page)).toHaveValue("2")
    await page.getByRole("button", { name: "Reset" }).click()
    await expect(quantity(page)).toHaveValue("1")
    await expect(amount(page)).toHaveValue("$1,234.50")
    await save(page)
    await expect
      .poll(() => status(page, "Submitted"))
      .toBe("quantity=1&amount=1234.5")
  }
)

test(
  "a typed value snaps to the step when focus leaves",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("number-input")
    await quantity(page).fill("2.6")
    await amount(page).focus()
    await expect(quantity(page)).toHaveValue("3")
    await expect.poll(() => status(page, "Committed")).toBe("quantity:3")
  }
)

test(
  "Enter commits and formats what's typed",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("number-input")
    await amount(page).fill("12.345")
    await page.keyboard.press("Enter")
    await expect(amount(page)).toHaveValue("$12.35")
    await expect.poll(() => status(page, "Committed")).toBe("amount:12.35")
  }
)

test(
  "holding an arrow key commits once, when the key comes up",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("number-input")
    await quantity(page).focus()
    await page.keyboard.down("ArrowUp")
    await page.keyboard.down("ArrowUp")
    await page.keyboard.down("ArrowUp")
    await expect(quantity(page)).toHaveValue("4")
    expect(await status(page, "Committed")).toBe("")
    await page.keyboard.up("ArrowUp")
    await expect.poll(() => status(page, "Committed")).toBe("quantity:4")
  }
)

test(
  "a field with cents asks for a decimal keypad",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("number-input")
    await expect(amount(page)).toHaveAttribute("inputmode", "decimal")
    await expect(quantity(page)).toHaveAttribute("inputmode", "numeric")
  }
)

test(
  "a scrub steps by distance, whatever the speed",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("number-input")
    await standInPointerLock(page)
    const box = (await scrubArea(page).boundingBox())!
    const start = { x: box.x + box.width / 2, y: box.y + box.height / 2 }
    // 20px in 20 moves, then 20px back in 2 moves, lands where it started.
    await page.mouse.move(start.x, start.y)
    await page.mouse.down()
    await page.mouse.move(start.x + 20, start.y, { steps: 20 })
    await expect(amount(page)).toHaveValue("$1,234.60")
    // The drag locked the pointer, so the moves back count by movement alone.
    expect(
      await scrubArea(page).evaluate((el) => document.pointerLockElement === el)
    ).toBe(true)
    await page.mouse.move(start.x, start.y, { steps: 2 })
    await expect(amount(page)).toHaveValue("$1,234.50")
    await page.mouse.up()
    expect(await page.evaluate(() => document.pointerLockElement)).toBeNull()
  }
)

test(
  "a scrub that doesn't move commits nothing",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await page.clock.install()
    await open("number-input")
    await scrubArea(page).click()
    await page.clock.runFor(100)
    expect(await status(page, "Committed")).toBe("")
  }
)
