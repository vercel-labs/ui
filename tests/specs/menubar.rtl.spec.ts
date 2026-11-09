import { expect, expectFocus, menuNamed, test } from "../fixtures"
import { enter, trigger } from "./menubar.helpers"

// Right to left, arrows follow the screen: ArrowLeft moves to the next menu.

test.beforeEach(async ({ open }) => {
  await open("menubar", { dir: "rtl" })
})

test("ArrowLeft moves to the next trigger and ArrowRight to the previous one", async ({
  page,
  tab,
}) => {
  await enter(page, tab)
  await page.keyboard.press("ArrowLeft")
  await expectFocus(page, "Edit")
  await page.keyboard.press("ArrowRight")
  await expectFocus(page, "File")
})

test("menus open below their trigger, lined up with its right edge", async ({
  page,
}) => {
  await trigger(page, "Edit").click()
  const menu = await menuNamed(page, "Edit").boundingBox()
  const button = await trigger(page, "Edit").boundingBox()
  expect(menu!.y).toBeGreaterThanOrEqual(button!.y + button!.height)
  expect(
    Math.abs(menu!.x + menu!.width - (button!.x + button!.width))
  ).toBeLessThanOrEqual(1)
})
