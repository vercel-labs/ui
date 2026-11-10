import { expect, test } from "../fixtures"
import { eventNamed } from "./chronology.helpers"

// Right to left, arrows follow the screen: ArrowLeft moves to the next event.

test("in a horizontal chronology, ArrowLeft moves to the next event and ArrowRight to the previous one", async ({
  page,
  open,
}) => {
  await open("chronology", { dir: "rtl", orientation: "horizontal" })
  await eventNamed(page, "Order placed").focus()
  await page.keyboard.press("ArrowLeft")
  await expect(eventNamed(page, "Packed")).toBeFocused()
  await page.keyboard.press("ArrowRight")
  await expect(eventNamed(page, "Order placed")).toBeFocused()
  expect(await page.evaluate(() => document.dir)).toBe("rtl")
})

test("in a vertical chronology, Up and Down work as they do left to right", async ({
  page,
  open,
}) => {
  await open("chronology", { dir: "rtl" })
  await eventNamed(page, "Order placed").focus()
  await page.keyboard.press("ArrowDown")
  await expect(eventNamed(page, "Packed")).toBeFocused()
  await page.keyboard.press("ArrowLeft")
  await expect(eventNamed(page, "Packed")).toBeFocused()
})
