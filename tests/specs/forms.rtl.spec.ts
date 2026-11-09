import { expect, test } from "../fixtures"
import { radio } from "./forms.helpers"

// Right-to-left layouts mirror the horizontal arrows of a radio group.

test("ArrowLeft moves to the next radio and ArrowRight to the previous one", async ({
  page,
  open,
}) => {
  await open("forms", { dir: "rtl", plan: "free" })
  await radio(page, "Free").focus()
  await page.keyboard.press("ArrowLeft")
  await expect(radio(page, "Pro")).toBeFocused()
  await expect(radio(page, "Pro")).toBeChecked()
  await page.keyboard.press("ArrowRight")
  await expect(radio(page, "Free")).toBeFocused()
  await expect(radio(page, "Free")).toBeChecked()
})

test("ArrowDown and ArrowUp keep their direction", async ({ page, open }) => {
  await open("forms", { dir: "rtl", plan: "free" })
  await radio(page, "Free").focus()
  await page.keyboard.press("ArrowDown")
  await expect(radio(page, "Pro")).toBeFocused()
  await page.keyboard.press("ArrowUp")
  await expect(radio(page, "Free")).toBeFocused()
})
