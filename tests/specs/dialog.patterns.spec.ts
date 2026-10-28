import type { Page } from "@playwright/test"
import { expect, lastAction, test } from "../fixtures"
import { dialogPatternsFixture as f } from "../fixtures/dialog"

// Patterns people rebuild on top of dialogs, built in: opening from a menu
// item, keyboard shortcuts, a dirty form that refuses to close, async
// actions, persistent elements, and popups inside a portaled popover.

const rename = (page: Page) => page.getByRole("dialog", { name: f.rename.title })
const renameTrigger = (page: Page) => page.getByRole("button", { name: f.rename.trigger, exact: true })
const nameField = (page: Page) => page.getByRole("textbox", { name: f.rename.field })
const remove = (page: Page) => page.getByRole("alertdialog", { name: f.remove.title })
const removeAction = (page: Page) => remove(page).getByRole("button", { name: f.remove.action })
const fileTrigger = (page: Page) => page.locator("button", { hasText: new RegExp(`^${f.menu.trigger}$`) })
// While a modal dialog is open the page is hidden from assistive technology, so it's found by id.
const chat = (page: Page) => page.locator("#chat")

const changes = (page: Page) =>
  page.evaluate(() => (window as unknown as { __openChanges?: string[] }).__openChanges ?? [])

const inert = (page: Page, selector: string) =>
  page.evaluate((selector) => !!document.querySelector(selector)?.closest("[inert]"), selector)

test.beforeEach(async ({ open }) => {
  await open("dialog-patterns")
})

test.describe("opening a dialog from a menu item", () => {
  test("choosing the item closes the menu and moves focus into the dialog", async ({ page }) => {
    await fileTrigger(page).click()
    await page.getByRole("menuitem", { name: f.menu.rename }).click()
    await expect(rename(page)).toBeVisible()
    await expect(page.getByRole("menu")).toHaveCount(0)
    await expect(nameField(page)).toBeFocused()
  })

  test("choosing the item with the keyboard moves focus into the dialog", async ({ page }) => {
    await fileTrigger(page).focus()
    await page.keyboard.press("Enter")
    await expect(page.getByRole("menuitem", { name: f.menu.rename })).toBeFocused()
    await page.keyboard.press("Enter")
    await expect(nameField(page)).toBeFocused()
  })
})

test.describe("opening a dialog from a menu item", { tag: "@enhancement" }, () => {
  test("the page around the dialog is inert, the menu's trigger included", async ({ page }) => {
    await fileTrigger(page).click()
    await page.getByRole("menuitem", { name: f.menu.rename }).click()
    await expect(nameField(page)).toBeFocused()
    expect(await inert(page, "[data-slot=menu-trigger]")).toBe(true)
  })

  test("closing the dialog returns focus to the menu's trigger", async ({ page }) => {
    await fileTrigger(page).focus()
    await page.keyboard.press("Enter")
    await expect(page.getByRole("menuitem", { name: f.menu.rename })).toBeFocused()
    await page.keyboard.press("Enter")
    await expect(nameField(page)).toBeFocused()
    await page.keyboard.press("Escape")
    await expect(rename(page)).toHaveCount(0)
    await expect(fileTrigger(page)).toBeFocused()
  })

  test("a dialog the item opens through its open prop returns focus to the menu's trigger", async ({
    page,
    framework,
  }) => {
    test.skip(
      framework.startsWith("web"),
      "The web fixture opens dialogs by controller; the focus return is shared core code.",
    )
    const trigger = page.getByRole("button", { name: f.details.menu, exact: true })
    await trigger.focus()
    await page.keyboard.press("Enter")
    await expect(page.getByRole("menuitem", { name: f.details.item })).toBeFocused()
    await page.keyboard.press("Enter")
    const details = page.getByRole("dialog", { name: f.details.title })
    await expect(details).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(details).toHaveCount(0)
    await expect(trigger).toBeFocused()
  })
})

test.describe("shortcuts", { tag: "@enhancement" }, () => {
  test("a trigger's shortcut opens the dialog", async ({ page }) => {
    await page.keyboard.press("ControlOrMeta+k")
    await expect(rename(page)).toBeVisible()
    await expect(nameField(page)).toBeFocused()
    expect(await changes(page)).toEqual(["rename:true:shortcut"])
  })

  test("the trigger advertises its shortcut, and shows it to sighted users only", async ({ page }) => {
    await expect(renameTrigger(page)).toHaveAttribute("aria-keyshortcuts", /^(Meta|Control)\+K$/)
    const hint = page.locator("[data-slot=dialog-shortcut]")
    await expect(hint).toHaveAttribute("aria-hidden", "true")
    await expect(hint).toHaveText(/^⁦?(⌘K|Ctrl\+K)⁩?$/)
  })

  test("a modal dialog pauses the page's shortcuts and keeps its own", async ({ page }) => {
    await renameTrigger(page).click()
    await expect(nameField(page)).toBeFocused()
    await page.keyboard.press("ControlOrMeta+j")
    expect(await lastAction(page)).toBe("")
    await page.keyboard.press("ControlOrMeta+s")
    await expect(page.getByRole("status", { includeHidden: true })).toHaveText("saved")
    await page.keyboard.press("Escape")
    await expect(rename(page)).toHaveCount(0)
    await page.keyboard.press("ControlOrMeta+j")
    expect(await lastAction(page)).toBe("page shortcut")
  })

  test("a dialog's own shortcut doesn't run while the dialog is closed", async ({ page }) => {
    await page.keyboard.press("ControlOrMeta+s")
    expect(await lastAction(page)).toBe("")
    await renameTrigger(page).click()
    await expect(nameField(page)).toBeFocused()
    await page.keyboard.press("Escape")
    await expect(rename(page)).toHaveCount(0)
    await page.keyboard.press("ControlOrMeta+s")
    expect(await lastAction(page)).toBe("")
  })

  test("menu and popover triggers take shortcuts too", async ({ page }) => {
    await expect(fileTrigger(page)).toHaveAttribute("aria-keyshortcuts", /^(Meta|Control)\+U$/)
    await page.keyboard.press("ControlOrMeta+u")
    await expect(page.getByRole("menuitem", { name: f.menu.rename })).toBeFocused()
    await page.keyboard.press("Escape")
    await expect(page.getByRole("menu")).toHaveCount(0)
    await page.keyboard.press("ControlOrMeta+i")
    await expect(page.getByRole("dialog", { name: f.share.title })).toBeVisible()
    await page.keyboard.press("ControlOrMeta+i")
    await expect(page.getByRole("dialog", { name: f.share.title })).toHaveCount(0)
  })

  test("plain keys typed in a text field are text, and modifier shortcuts still run", async ({ page }) => {
    await page.getByRole("textbox", { name: f.search }).focus()
    await page.keyboard.press("/")
    expect(await lastAction(page)).toBe("")
    await page.keyboard.press("ControlOrMeta+j")
    expect(await lastAction(page)).toBe("page shortcut")
  })

  test("a plain-key shortcut runs outside text fields", async ({ page }) => {
    await page.getByRole("button", { name: "Before" }).focus()
    await page.keyboard.press("/")
    expect(await lastAction(page)).toBe("slash")
  })
})

test.describe("a dirty form", { tag: "@enhancement" }, () => {
  test("refuses Escape and outside presses, and reports each attempt", async ({ page }) => {
    await renameTrigger(page).click()
    await nameField(page).fill("draft.txt")
    await page.keyboard.press("Escape")
    await expect(rename(page)).toBeVisible()
    await expect(page.getByRole("status", { includeHidden: true })).toHaveText("attempt:escape-key")
    await page.mouse.click(5, 5)
    await expect(rename(page)).toBeVisible()
    await expect(page.getByRole("status", { includeHidden: true })).toHaveText("attempt:outside-press")
    await rename(page).getByRole("button", { name: f.rename.cancel }).click()
    await expect(rename(page)).toHaveCount(0)
    expect(await changes(page)).toEqual(["rename:true:trigger-press", "rename:false:close-press"])
  })

  test("a clean form closes on Escape", async ({ page }) => {
    await renameTrigger(page).click()
    await expect(nameField(page)).toBeFocused()
    await page.keyboard.press("Escape")
    await expect(rename(page)).toHaveCount(0)
  })
})

test.describe("persistent elements", { tag: "@enhancement" }, () => {
  test("stay usable while a modal dialog is open, and pressing them keeps it open", async ({ page }) => {
    await renameTrigger(page).click()
    await expect(nameField(page)).toBeFocused()
    expect(await inert(page, "#chat")).toBe(false)
    expect(await inert(page, "[data-slot=menu-trigger]")).toBe(true)
    // A backdrop covers it, so it's reached the way a screen reader or a password manager would.
    await chat(page).focus()
    await expect(chat(page)).toBeFocused()
    await page.keyboard.press("Enter")
    await expect(page.getByRole("status", { includeHidden: true })).toHaveText("chat")
    await expect(rename(page)).toBeVisible()
  })
})

test.describe("async actions", { tag: "@enhancement" }, () => {
  test("keep the alert dialog open and pending, then close with reason action", async ({ page }) => {
    await page.getByRole("button", { name: f.remove.trigger }).click()
    await removeAction(page).click()
    await expect(removeAction(page)).toHaveAttribute("data-pending", "")
    await expect(removeAction(page)).toHaveAttribute("aria-busy", "true")
    await page.keyboard.press("Escape")
    await remove(page).getByRole("button", { name: f.remove.cancel }).click()
    await expect(remove(page), "nothing but the action closes it meanwhile").toBeVisible()
    await page.evaluate(() => (window as unknown as { __action: { resolve: () => void } }).__action.resolve())
    await expect(remove(page)).toHaveCount(0)
    expect(await changes(page)).toEqual(["delete:true:trigger-press", "delete:false:action"])
  })

  test("a failed action keeps the alert dialog open and stops pending", async ({ page }) => {
    await page.getByRole("button", { name: f.remove.trigger }).click()
    await removeAction(page).click()
    await expect(removeAction(page)).toHaveAttribute("data-pending", "")
    await page.evaluate(() =>
      (window as unknown as { __action: { reject: (message: string) => void } }).__action.reject("Offline"),
    )
    await expect(removeAction(page)).not.toHaveAttribute("data-pending")
    await expect(remove(page)).toBeVisible()
    await removeAction(page).click()
    await expect(removeAction(page), "it can be tried again").toHaveAttribute("data-pending", "")
  })
})

test.describe("popups inside a portaled popover", { tag: "@enhancement" }, () => {
  test("a menu and a dialog inside it render into the popover's container", async ({ page }) => {
    await page.getByRole("button", { name: f.share.trigger }).click()
    await page.getByRole("button", { name: f.share.menu }).click()
    await expect(page.getByRole("menuitem", { name: f.share.item })).toBeVisible()
    expect(
      await page.evaluate(() => !!document.querySelector("#popover-root [data-slot=menu-content]")),
    ).toBe(true)
    await page.keyboard.press("Escape")
    await expect(page.getByRole("menu")).toHaveCount(0)
    await page.getByRole("button", { name: f.share.dialog }).click()
    await expect(page.getByRole("dialog", { name: f.share.dialogTitle })).toBeVisible()
    expect(
      await page.evaluate(() => !!document.querySelector("#popover-root [data-slot=dialog-content]")),
    ).toBe(true)
  })
})

test.describe("Android's back gesture", { tag: "@enhancement" }, () => {
  test.use({
    userAgent:
      "Mozilla/5.0 (Linux; Android 15; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Mobile Safari/537.36",
  })

  test("closes the topmost dialog with reason back", async ({ page, browserName, open }) => {
    test.skip(browserName !== "chromium", "CloseWatcher is in Chromium only.")
    // Keep each close watcher the dialog creates, to send it a close request.
    await page.addInitScript(() => {
      const Native = (window as unknown as { CloseWatcher: new () => EventTarget }).CloseWatcher
      const watchers: EventTarget[] = []
      ;(window as unknown as { __watchers: EventTarget[] }).__watchers = watchers
      ;(window as unknown as { CloseWatcher: unknown }).CloseWatcher = class extends Native {
        constructor() {
          super()
          watchers.push(this)
        }
      }
    })
    await open("dialog-patterns")
    await renameTrigger(page).click()
    await expect(nameField(page)).toBeFocused()
    await page.evaluate(() =>
      (window as unknown as { __watchers: { requestClose: () => void }[] }).__watchers.at(-1)!.requestClose(),
    )
    await expect(rename(page)).toHaveCount(0)
    expect(await changes(page)).toEqual(["rename:true:trigger-press", "rename:false:back"])
  })
})
