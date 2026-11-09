import { expect, expectFocus, menuNamed, test } from "../fixtures"
import { closed, enter, trigger } from "./menubar.helpers"

// Behavior past the WAI-ARIA pattern, tagged `@enhancement`.

test.describe("enhancements", { tag: "@enhancement" }, () => {
  test.beforeEach(async ({ open }) => {
    await open("menubar")
  })

  test("Right in an open menu opens the next menu at its first item, and Left the previous one", async ({
    page,
    tab,
  }) => {
    await enter(page, tab)
    await page.keyboard.press("ArrowDown")
    await expectFocus(page, "New Tab")
    await page.keyboard.press("ArrowRight")
    await expect(menuNamed(page, "Edit")).toBeVisible()
    await expectFocus(page, "Undo")
    await closed(page, "File")
    await page.keyboard.press("ArrowLeft")
    await expectFocus(page, "New Tab")
    await closed(page, "Edit")
  })

  test("Right on an item in a submenu moves to the next menu at its first item", async ({
    page,
    tab,
  }) => {
    await enter(page, tab)
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("ArrowDown")
    await expectFocus(page, "Share")
    await page.keyboard.press("ArrowRight")
    await expectFocus(page, "Email link")
    await page.keyboard.press("ArrowLeft")
    await expectFocus(page, "Share")
    await expect(menuNamed(page, "File")).toBeVisible()
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("ArrowRight")
    await expectFocus(page, "Undo")
    await closed(page, "File")
    await closed(page, "Share")
  })

  test("ArrowUp opens a menu and focuses its last item", async ({
    page,
    tab,
  }) => {
    await enter(page, tab)
    await page.keyboard.press("ArrowUp")
    await expectFocus(page, "Print…")
  })

  test("Shift+Tab in an open menu closes it and moves before the menubar", async ({
    page,
    tab,
  }) => {
    await enter(page, tab)
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("ArrowDown")
    await expectFocus(page, "Undo")
    await tab({ shift: true })
    await closed(page, "Edit")
    await expectFocus(page, "Before")
  })

  test("pointing at another trigger and pressing it keeps its menu open", async ({
    page,
  }) => {
    await trigger(page, "File").click()
    await trigger(page, "Edit").click()
    await expect(menuNamed(page, "Edit")).toBeVisible()
    await closed(page, "File")
    await trigger(page, "Edit").click()
    await closed(page, "Edit")
  })

  test("a disabled trigger stays focusable, says it's disabled and opens nothing", async ({
    page,
    tab,
  }) => {
    await enter(page, tab)
    await page.keyboard.press("ArrowLeft")
    await expectFocus(page, "Help")
    await expect(trigger(page, "Help")).toHaveAttribute("aria-disabled", "true")
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("Enter")
    await expect(page.getByRole("menu")).toHaveCount(0)
  })

  test("moving from an open menu to a disabled one focuses its trigger and opens nothing", async ({
    page,
    tab,
  }) => {
    await enter(page, tab)
    await page.keyboard.press("ArrowDown")
    await expectFocus(page, "New Tab")
    await page.keyboard.press("ArrowLeft")
    await expectFocus(page, "Help")
    await expect(page.getByRole("menu")).toHaveCount(0)
  })

  test("a disabled menubar keeps its tab stop and opens nothing", async ({
    page,
    open,
    tab,
  }) => {
    await open("menubar", { disabled: "" })
    await enter(page, tab)
    await expect(trigger(page, "File")).toHaveAttribute("aria-disabled", "true")
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("ArrowRight")
    await expectFocus(page, "Edit")
    await expect(page.getByRole("menu")).toHaveCount(0)
  })

  test("a disabled menubar ignores its triggers' shortcuts", async ({
    page,
    open,
  }) => {
    await open("menubar", { disabled: "" })
    await page.getByRole("button", { name: "Before" }).focus()
    await page.keyboard.press("Alt+Shift+V")
    await expect(page.getByRole("menu")).toHaveCount(0)
  })

  test("a trigger's shortcut opens its menu", async ({ page, open }) => {
    await open("menubar")
    await page.getByRole("button", { name: "Before" }).focus()
    await page.keyboard.press("Alt+Shift+V")
    await expect(menuNamed(page, "View")).toBeVisible()
  })

  test("menus defined before the menubar join it once it upgrades", async ({
    page,
    open,
    tab,
  }) => {
    await open("menubar", { "menus-first": "" })
    await enter(page, tab)
    await page.keyboard.press("ArrowRight")
    await expectFocus(page, "Edit")
    await expect(trigger(page, "Edit")).toHaveAttribute("tabindex", "0")
  })

  test("typing a letter focuses the next trigger that starts with it", async ({
    page,
    tab,
  }) => {
    await enter(page, tab)
    await page.keyboard.press("p")
    await expectFocus(page, "Profiles")
  })

  test("in a vertical menubar, Left in an open menu closes it and focuses its trigger", async ({
    page,
    open,
    tab,
  }) => {
    await open("menubar", { orientation: "vertical" })
    await enter(page, tab)
    await page.keyboard.press("ArrowRight")
    await expectFocus(page, "New Tab")
    await page.keyboard.press("ArrowLeft")
    await closed(page, "File")
    await expectFocus(page, "File")
  })

  test("a controller focuses the menubar and closes its open menu", async ({
    page,
    tab,
  }) => {
    await enter(page, tab)
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("ArrowDown")
    await expectFocus(page, "Undo")
    // The fixture puts its controller on the window, since a press outside would close the menu itself.
    const controller = () =>
      (
        window as unknown as {
          __menubar: { close: () => void; focus: () => void }
        }
      ).__menubar
    await page.evaluate(`(${controller})().close()`)
    await closed(page, "Edit")
    await page.getByRole("button", { name: "Before" }).focus()
    await page.evaluate(`(${controller})().focus()`)
    await expectFocus(page, "Edit")
  })
})
