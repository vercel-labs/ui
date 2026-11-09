import { expect, expectFocus, test } from "../fixtures"

// Right to left, arrows follow the screen: ArrowLeft moves to the next item.

test.beforeEach(async ({ open }) => {
  await open("toolbar", { dir: "rtl" })
})

test("ArrowLeft moves to the next item and ArrowRight to the previous one", async ({
  page,
  tab,
}) => {
  await page.getByRole("button", { name: "Before" }).focus()
  await tab()
  await expectFocus(page, "Bold")
  await page.keyboard.press("ArrowLeft")
  await expectFocus(page, "Italic")
  await page.keyboard.press("ArrowRight")
  await expectFocus(page, "Bold")
})

test("a text field keeps the arrow toward its text, and the other one leaves it", async ({
  page,
}) => {
  const comment = page.getByRole("textbox", { name: "Comment" })
  await comment.focus()
  await comment.evaluate((el: HTMLInputElement) =>
    el.setSelectionRange(el.value.length, el.value.length)
  )
  await page.keyboard.press("ArrowLeft")
  await expectFocus(page, "Undo")
  expect(await page.evaluate(() => document.dir)).toBe("rtl")
})
