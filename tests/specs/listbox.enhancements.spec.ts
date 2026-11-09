import type { Page } from "@playwright/test"
import { changeItems, expect, test } from "../fixtures"
import { expectSelected, list, option, tabIn } from "./listbox.helpers"

// Behavior past the WAI-ARIA listbox pattern, tagged `@enhancement`.

test("keys pressed with no waits between them all land @enhancement", async ({
  page,
  open,
  tab,
}) => {
  await open("listbox", { multiple: "" })
  await tabIn(page, tab)
  await page.keyboard.press("ArrowDown")
  await page.keyboard.press(" ")
  await page.keyboard.press("Shift+ArrowDown")
  await page.keyboard.press("Shift+ArrowDown")
  await expectSelected(page, ["Cheese", "Garlic", "Mushroom"])
  await expect(option(page, "Mushroom")).toBeFocused()
})

test("Escape leaves the selection alone and reaches a dialog around the list @enhancement", async ({
  page,
  open,
}) => {
  await open("listbox", { multiple: "", value: "basil,onion" })
  await page.evaluate(() => {
    const heard = { escape: false, prevented: false }
    Object.assign(window, { heard })
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") {
        return
      }
      heard.escape = true
      heard.prevented = event.defaultPrevented
    })
  })
  await option(page, "Basil").focus()
  await page.keyboard.press("Escape")
  await expectSelected(page, ["Basil", "Onion"])
  expect(
    await page.evaluate(() => (window as unknown as { heard: object }).heard)
  ).toEqual({
    escape: true,
    prevented: false,
  })
})

test("a Shift press after the selection was cleared starts a new range there @enhancement", async ({
  page,
  open,
}) => {
  await open("listbox", { multiple: "" })
  await option(page, "Basil").click()
  await page.keyboard.press("ControlOrMeta+a")
  await page.keyboard.press("ControlOrMeta+a")
  await expectSelected(page, [])
  await option(page, "Garlic").click({ modifiers: ["Shift"] })
  await expectSelected(page, ["Garlic"])
})

test("Shift with an arrow never wraps past the end @enhancement", async ({
  page,
  open,
}) => {
  await open("listbox", { multiple: "" })
  await option(page, "Pepper").click()
  await page.keyboard.press("Shift+ArrowDown")
  await page.keyboard.press("Shift+ArrowDown")
  await expect(option(page, "Tomato")).toBeFocused()
  await expectSelected(page, ["Pepper", "Tomato"])
})

test("a Shift press doesn't select the page's text @enhancement", async ({
  page,
  open,
}) => {
  await open("listbox", { multiple: "" })
  await option(page, "Basil").click()
  await option(page, "Onion").click({ modifiers: ["Shift"] })
  expect(
    await page.evaluate(() => document.getSelection()?.toString() ?? "")
  ).toBe("")
  await expect(option(page, "Onion")).toBeFocused()
})

test("the selected option scrolls into view without taking focus @enhancement", async ({
  page,
  open,
}) => {
  await open("listbox", { long: "", value: "topping-200" })
  await expect(option(page, "Topping 200")).toBeInViewport()
  expect(
    await page.evaluate(() => document.activeElement === document.body)
  ).toBe(true)
})

// How far an option sits from the 32px scroll padding at each edge of the list.
// Scroll positions are whole pixels and options aren't, so a pixel is close enough.
function offPadding(page: Page, name: string) {
  return option(page, name).evaluate((el) => {
    const list = el.closest('[role="listbox"]')!
    const top = list.getBoundingClientRect().top + list.clientTop
    const box = el.getBoundingClientRect()
    return {
      top: Math.abs(box.top - top - 32),
      bottom: Math.abs(top + list.clientHeight - box.bottom - 32),
    }
  })
}

test("arrow keys keep the focused option clear of the list's scroll padding at both ends @enhancement", async ({
  page,
  open,
  tab,
}) => {
  await open("listbox", { long: "", layout: "scroll-padding" })
  await tabIn(page, tab)
  for (let press = 0; press < 20; press++) {
    await page.keyboard.press("ArrowDown")
  }
  await expect(option(page, "Topping 21")).toBeFocused()
  expect((await offPadding(page, "Topping 21")).bottom).toBeLessThan(1)
  await page.keyboard.press("End")
  for (let press = 0; press < 30; press++) {
    await page.keyboard.press("ArrowUp")
  }
  await expect(option(page, "Topping 270")).toBeFocused()
  expect((await offPadding(page, "Topping 270")).top).toBeLessThan(1)
})

test("the selected option scrolls into view clear of the list's scroll padding @enhancement", async ({
  page,
  open,
}) => {
  await open("listbox", {
    long: "",
    value: "topping-200",
    layout: "scroll-padding",
  })
  await expect
    .poll(async () => (await offPadding(page, "Topping 200")).bottom)
    .toBeLessThan(1)
})

test("a focused option that leaves the list hands focus back to it, so keys keep working @enhancement", async ({
  page,
  open,
}) => {
  await open("listbox", { value: "garlic" })
  await option(page, "Cheese").focus()
  await changeItems(page, "without-cheese")
  await expect(option(page, "Cheese")).toHaveCount(0)
  await expect(option(page, "Garlic")).toBeFocused()
  await page.keyboard.press("ArrowDown")
  await expect(option(page, "Mushroom")).toBeFocused()
})

test("options that all leave take the tab stop with them, and options that come back hold it again @enhancement", async ({
  page,
  open,
}) => {
  await open("listbox")
  await changeItems(page, "none")
  await expect(list(page).getByRole("option")).toHaveCount(0)
  await changeItems(page, "reversed")
  await expect(list(page).getByRole("option").first()).toHaveText(/Tomato/)
  // One option, and only one, is in the tab order again.
  await expect(list(page).locator('[role="option"][tabindex="0"]')).toHaveCount(
    1
  )
})

test("options the app reorders keep their place in the keys @enhancement", async ({
  page,
  open,
}) => {
  await open("listbox", { activation: "manual" })
  await option(page, "Tomato").focus()
  await changeItems(page, "reversed")
  await expect(list(page).getByRole("option").first()).toHaveText(/Tomato/)
  await page.keyboard.press("ArrowDown")
  await expect(option(page, "Pepper")).toBeFocused()
})

test("a press on the list's padding gives focus to the option that holds the tab stop @enhancement", async ({
  page,
  open,
}) => {
  await open("listbox", { value: "onion" })
  const box = await list(page).boundingBox()
  // The top padding, clear of the rounded corners.
  await page.mouse.click(box!.x + box!.width / 2, box!.y + 2)
  await expect(option(page, "Onion")).toBeFocused()
})

test.describe("touch", () => {
  test.use({ hasTouch: true })

  test("taps toggle where clicks replace, since touch has no modifier keys @enhancement", async ({
    page,
    open,
  }) => {
    await open("listbox", { multiple: "", activation: "automatic" })
    await option(page, "Basil").tap()
    await option(page, "Onion").tap()
    await expectSelected(page, ["Basil", "Onion"])
    await option(page, "Basil").tap()
    await expectSelected(page, ["Onion"])
  })
})
