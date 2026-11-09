import { buttonNamed, expect, test } from "../fixtures"

// Right-to-left layouts mirror the horizontal arrows.

test.beforeEach(async ({ open }) => {
  await open("toggle", { dir: "rtl" })
})

test("ArrowLeft moves to the next toggle and ArrowRight to the previous one", async ({
  page,
}) => {
  await buttonNamed(page, "Left").focus()
  await page.keyboard.press("ArrowLeft")
  await expect(buttonNamed(page, "Center")).toBeFocused()
  await page.keyboard.press("ArrowRight")
  await expect(buttonNamed(page, "Left")).toBeFocused()
})

test("Home and End still go to the first and last toggles", async ({
  page,
}) => {
  await buttonNamed(page, "Left").focus()
  await page.keyboard.press("End")
  await expect(buttonNamed(page, "Right")).toBeFocused()
  await page.keyboard.press("Home")
  await expect(buttonNamed(page, "Left")).toBeFocused()
})
