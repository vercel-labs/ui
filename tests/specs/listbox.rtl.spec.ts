import { expect, test } from "../fixtures"
import { expectSelected, option } from "./listbox.helpers"

// In right-to-left text, a horizontal list runs from the right, so Left moves forward.
test("Left moves to the next option of a horizontal list in right-to-left text", async ({
  page,
  open,
}) => {
  await open("listbox", { dir: "rtl", orientation: "horizontal" })
  await option(page, "Basil").focus()
  await page.keyboard.press("ArrowLeft")
  await expect(option(page, "Cheese")).toBeFocused()
  await expectSelected(page, ["Cheese"])
  await page.keyboard.press("ArrowRight")
  await expect(option(page, "Basil")).toBeFocused()
})

test("a vertical list keeps Up and Down in right-to-left text", async ({
  page,
  open,
}) => {
  await open("listbox", { dir: "rtl" })
  await option(page, "Basil").focus()
  await page.keyboard.press("ArrowDown")
  await expect(option(page, "Cheese")).toBeFocused()
  await page.keyboard.press("ArrowLeft")
  await expect(option(page, "Cheese")).toBeFocused()
})

test("Shift with Left extends a horizontal range in right-to-left text", async ({
  page,
  open,
}) => {
  await open("listbox", { dir: "rtl", orientation: "horizontal", multiple: "" })
  await option(page, "Basil").click()
  await page.keyboard.press("Shift+ArrowLeft")
  await expectSelected(page, ["Basil", "Cheese"])
})
