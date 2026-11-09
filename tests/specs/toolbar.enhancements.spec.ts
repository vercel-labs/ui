import { expect, expectFocus, test } from "../fixtures"
import { walkTo } from "./toolbar.helpers"

// Behavior past the WAI-ARIA pattern, tagged `@enhancement`.

test.describe("enhancements", { tag: "@enhancement" }, () => {
  test.beforeEach(async ({ open }) => {
    await open("toolbar")
  })

  test("Home and End go to the first and last items", async ({ page, tab }) => {
    await walkTo(page, tab, "Center")
    await page.keyboard.press("End")
    await expectFocus(page, "Help")
    await page.keyboard.press("Home")
    await expectFocus(page, "Bold")
  })

  test("one arrow press moves through a text field each way, and the other way edits it", async ({
    page,
    tab,
  }) => {
    await walkTo(page, tab, "Font")
    await page.keyboard.press("ArrowRight")
    await expectFocus(page, "Font size")
    await page.keyboard.press("ArrowRight")
    await expectFocus(page, "Comment")
    await page.keyboard.press("ArrowRight")
    await expectFocus(page, "Undo")
    await page.keyboard.press("ArrowLeft")
    await expectFocus(page, "Comment")
    await page.keyboard.press("ArrowLeft")
    await expectFocus(page, "Font size")
    await page.keyboard.press("ArrowRight")
    await expectFocus(page, "Font size")
    expect(
      await page
        .getByRole("textbox", { name: "Font size" })
        .evaluate((el: HTMLInputElement) => el.selectionStart)
    ).toBe(1)
  })

  test("a controller focuses the toolbar's tab stop from anywhere", async ({
    page,
    tab,
  }) => {
    await walkTo(page, tab, "Right")
    await page.getByRole("button", { name: "Focus toolbar" }).click()
    await expectFocus(page, "Right")
  })
})
