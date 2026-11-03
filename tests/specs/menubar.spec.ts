import { expect, expectFocus, lastAction, menuNamed, test } from "../fixtures"
import { closed, enter, menubar, trigger } from "./menubar.helpers"

// A row of menus with one tab stop, like the WAI-ARIA menubar pattern:
// https://www.w3.org/WAI/ARIA/apg/patterns/menubar/

test.beforeEach(async ({ open }) => {
  await open("menubar")
})

test("the menubar is named, and its triggers are menu items that open menus", async ({ page }) => {
  await expect(menubar(page)).toBeVisible()
  await expect(menubar(page)).toHaveAttribute("aria-orientation", "horizontal")
  await expect(trigger(page, "File")).toHaveAttribute("aria-haspopup", "menu")
  await expect(trigger(page, "File")).toHaveAttribute("aria-expanded", "false")
})

test("the menubar is one tab stop, on its first trigger", async ({ page, tab }) => {
  await enter(page, tab)
  await tab()
  await expectFocus(page, "After")
  await tab({ shift: true })
  await expectFocus(page, "File")
})

test("Left and Right move between triggers, and Home goes to the first", async ({ page, tab }) => {
  await enter(page, tab)
  await page.keyboard.press("ArrowRight")
  await expectFocus(page, "Edit")
  await page.keyboard.press("ArrowRight")
  await expectFocus(page, "View")
  await page.keyboard.press("ArrowLeft")
  await expectFocus(page, "Edit")
  await page.keyboard.press("Home")
  await expectFocus(page, "File")
  await expect(menuNamed(page, "File")).toHaveCount(0)
})

test("Tab comes back to the trigger used last", async ({ page, tab }) => {
  await enter(page, tab)
  await page.keyboard.press("ArrowRight")
  await expectFocus(page, "Edit")
  await tab()
  await expectFocus(page, "After")
  await tab({ shift: true })
  await expectFocus(page, "Edit")
})

for (const key of ["ArrowDown", "Enter", "Space"]) {
  test(`${key} opens a menu and focuses its first item`, async ({ page, tab }) => {
    await enter(page, tab)
    await page.keyboard.press(key)
    await expect(menuNamed(page, "File")).toBeVisible()
    await expectFocus(page, "New Tab")
    await expect(trigger(page, "File")).toHaveAttribute("aria-expanded", "true")
  })
}

test("Escape closes the menu and focuses its trigger", async ({ page, tab }) => {
  await enter(page, tab)
  await page.keyboard.press("ArrowRight")
  await page.keyboard.press("Enter")
  await expectFocus(page, "Undo")
  await page.keyboard.press("Escape")
  await closed(page, "Edit")
  await expectFocus(page, "Edit")
})

test("Tab in an open menu closes it and moves past the menubar", async ({ page, tab }) => {
  await enter(page, tab)
  await page.keyboard.press("ArrowDown")
  await expectFocus(page, "New Tab")
  await tab()
  await closed(page, "File")
  await expectFocus(page, "After")
})

test("a press opens a menu, and a press on its trigger closes it", async ({ page }) => {
  await trigger(page, "File").click()
  await expect(menuNamed(page, "File")).toBeVisible()
  await trigger(page, "File").click()
  await closed(page, "File")
})

test("while a menu is open, pointing at another trigger opens its menu instead", async ({ page }) => {
  await trigger(page, "File").click()
  await expect(menuNamed(page, "File")).toBeVisible()
  await trigger(page, "View").hover()
  await expect(menuNamed(page, "View")).toBeVisible()
  await closed(page, "File")
  await page.keyboard.press("ArrowDown")
  await expectFocus(page, "Show bookmarks")
})

test("crossing another trigger on the way to the open menu keeps the menu", async ({ page }) => {
  await trigger(page, "File").click()
  const from = (await trigger(page, "File").boundingBox())!
  const to = (await page.getByRole("menuitem", { name: "Print…" }).boundingBox())!
  await page.mouse.move(from.x + from.width - 6, from.y + 6)
  await page.mouse.move(to.x + to.width - 20, to.y + to.height / 2, { steps: 20 })
  await expect(menuNamed(page, "File")).toBeVisible()
  await expect(menuNamed(page, "Edit")).toHaveCount(0)
})

test("resting on another trigger on the way to the open menu switches to it", async ({ page, open }) => {
  await page.clock.install()
  await open("menubar")
  await trigger(page, "File").click()
  const file = (await trigger(page, "File").boundingBox())!
  await page.mouse.move(file.x + file.width - 6, file.y + 6)
  const edit = (await trigger(page, "Edit").boundingBox())!
  await page.mouse.move(edit.x + 8, edit.y + edit.height - 4, { steps: 4 })
  await expect(menuNamed(page, "File")).toBeVisible()
  await page.clock.runFor(300)
  await expect(menuNamed(page, "Edit")).toBeVisible()
})

test("while a menu is open, pointing at a disabled trigger closes it and opens nothing", async ({ page }) => {
  await trigger(page, "File").click()
  await expect(menuNamed(page, "File")).toBeVisible()
  await trigger(page, "Help").hover()
  await expect(page.getByRole("menu")).toHaveCount(0)
  await expectFocus(page, "Help")
})

test("after pointing at a disabled trigger, pointing at another trigger opens its menu", async ({ page }) => {
  await trigger(page, "File").click()
  await expect(menuNamed(page, "File")).toBeVisible()
  await trigger(page, "Help").hover()
  await expect(page.getByRole("menu")).toHaveCount(0)
  await trigger(page, "View").hover()
  await expect(menuNamed(page, "View")).toBeVisible()
})

test("pointing at a trigger while every menu is closed opens nothing", async ({ page }) => {
  await trigger(page, "File").hover()
  await trigger(page, "Edit").hover()
  await expect(page.getByRole("menu")).toHaveCount(0)
})

test("a press outside closes the open menu", async ({ page }) => {
  await trigger(page, "File").click()
  await expect(menuNamed(page, "File")).toBeVisible()
  await page.mouse.click(5, 400)
  await closed(page, "File")
})

test("choosing an item runs it, closes the menu and focuses its trigger", async ({ page, tab }) => {
  await enter(page, tab)
  await page.keyboard.press("ArrowDown")
  await page.keyboard.press("ArrowDown")
  await page.keyboard.press("Enter")
  expect(await lastAction(page)).toBe("new-window")
  await closed(page, "File")
  await expectFocus(page, "File")
})

test("checkbox and radio items work in a menubar's menus", async ({ page }) => {
  await trigger(page, "View").click()
  await page.getByRole("menuitemcheckbox", { name: "Show full URLs" }).click()
  expect(await lastAction(page)).toBe("urls: on")
  await page.keyboard.press("Escape")
  await closed(page, "View")
  await trigger(page, "Profiles").click()
  await expect(page.getByRole("menuitemradio", { name: "Inès" })).toHaveAttribute("aria-checked", "true")
  await page.getByRole("menuitemradio", { name: "Kofi" }).click()
  expect(await lastAction(page)).toBe("profile: kofi")
})

test("a disabled item in a menubar's menu is focusable and does nothing", async ({ page, tab }) => {
  await enter(page, tab)
  await page.keyboard.press("ArrowRight")
  await page.keyboard.press("ArrowDown")
  await page.keyboard.press("ArrowDown")
  await expectFocus(page, "Redo")
  await page.keyboard.press("Enter")
  await expect(menuNamed(page, "Edit")).toBeVisible()
})

test("with loop off, arrows stop at the ends", async ({ page, open, tab }) => {
  await open("menubar", { loop: "false" })
  await enter(page, tab)
  await page.keyboard.press("ArrowLeft")
  await expectFocus(page, "File")
})

test.describe("vertical", () => {
  test.beforeEach(async ({ open }) => {
    await open("menubar", { orientation: "vertical" })
  })

  test("Up and Down move between triggers, and Right opens a menu to the side", async ({ page, tab }) => {
    await expect(menubar(page)).toHaveAttribute("aria-orientation", "vertical")
    await enter(page, tab)
    await page.keyboard.press("ArrowDown")
    await expectFocus(page, "Edit")
    await page.keyboard.press("ArrowRight")
    await expectFocus(page, "Undo")
    const menu = await menuNamed(page, "Edit").boundingBox()
    const button = await trigger(page, "Edit").boundingBox()
    expect(menu!.x).toBeGreaterThanOrEqual(button!.x + button!.width - 1)
  })
})
