import type { Locator, Page } from "@playwright/test"
import { expect, shortcutKeys, test } from "../fixtures"
import { popoverFixture as f } from "../fixtures/popover"

// Behavior past the WAI-ARIA pattern, tagged `@enhancement`.

const dialog = (page: Page) =>
  page.getByRole("dialog", { name: "Edit profile" })
const trigger = (page: Page) => page.getByRole("button", { name: "Profile" })
const field = (page: Page) =>
  page.getByRole("textbox", { name: "Display name" })

test.describe("enhancements", { tag: "@enhancement" }, () => {
  test("the popup writes --arrow-offset, where the trigger's center falls along its edge", async ({
    page,
    open,
  }) => {
    for (const align of ["center", "start", "end"]) {
      await open("popover", { align })
      await trigger(page).click()
      await expect(dialog(page)).toBeVisible()
      const { offset, center, length } = await dialog(page).evaluate((el) => {
        const trigger = document
          .querySelector<HTMLElement>('[aria-haspopup="dialog"]')!
          .getBoundingClientRect()
        const box = el.getBoundingClientRect()
        return {
          offset: parseFloat(el.style.getPropertyValue("--arrow-offset")),
          center: trigger.left + trigger.width / 2 - box.left - el.clientLeft,
          length: el.clientWidth,
        }
      })
      // Clamped by arrowPadding (6) when the center falls past a corner.
      expect(
        Math.abs(offset - Math.min(Math.max(center, 6), length - 6)),
        align
      ).toBeLessThanOrEqual(1)
    }
  })

  test("without a title, the trigger names the popover", async ({
    page,
    open,
  }) => {
    await open("popover", { untitled: "" })
    await trigger(page).click()
    await expect(page.getByRole("dialog", { name: "Profile" })).toBeVisible()
  })

  test("Tab from the trigger of a popover opened by hover moves into it", async ({
    page,
    open,
    tab,
  }) => {
    await open("popover", { hover: "", delay: "50" })
    await trigger(page).focus()
    await trigger(page).hover()
    await expect(dialog(page)).toBeVisible()
    await tab()
    await expect(field(page)).toBeFocused()
    // Working inside keeps it open after the pointer leaves.
    await page.mouse.move(2, 400)
    await page.waitForTimeout(200)
    await expect(dialog(page)).toBeVisible()
  })

  test("a controller opens the popover from anywhere and moves focus in", async ({
    page,
    open,
  }) => {
    await open("popover")
    await page.getByRole("button", { name: "Open with controller" }).click()
    await expect(field(page)).toBeFocused()
  })

  test("a popover open from the start leaves focus alone", async ({
    page,
    open,
  }) => {
    await open("popover", { open: "" })
    await expect(dialog(page)).toBeVisible()
    await page.waitForTimeout(100)
    expect(
      await page.evaluate(() => document.activeElement === document.body)
    ).toBe(true)
  })

  test("modal popovers make the rest of the page inert and restore it exactly", async ({
    page,
    open,
  }) => {
    await open("popover", { modal: "true" })
    const before = await page.evaluate(
      () => document.documentElement.style.cssText
    )
    const inert = () =>
      page
        .locator("button", { hasText: "Before" })
        .evaluate((el) => (el as HTMLElement).inert)
    await trigger(page).click()
    await expect(dialog(page)).toBeVisible()
    expect(await inert()).toBe(true)
    await page.keyboard.press("Escape")
    await expect(dialog(page)).toBeHidden()
    expect(await inert()).toBe(false)
    expect(
      await page.evaluate(() => document.documentElement.style.cssText)
    ).toBe(before)
  })

  test("live regions keep announcing while a modal popover makes the page inert", async ({
    page,
    open,
  }) => {
    await open("popover", { modal: "true" })
    await trigger(page).click()
    await expect(dialog(page)).toBeVisible()
    expect(
      await page
        .locator("button", { hasText: "Before" })
        .evaluate((el) => (el as HTMLElement).inert)
    ).toBe(true)
    expect(
      await page.locator("output").evaluate((el) => !!el.closest("[inert]"))
    ).toBe(false)
  })

  test("clicking into an iframe closes the popover", async ({
    page,
    open,
    browserName,
  }) => {
    // Playwright's Firefox keeps the window focused, so it never fires blur.
    test.skip(browserName === "firefox", "No window blur in automated Firefox.")
    await open("popover")
    await page.evaluate(() => {
      const frame = document.createElement("iframe")
      frame.title = "Embedded"
      frame.srcdoc = "<button>Inside</button>"
      frame.style.cssText =
        "position: fixed; right: 0; bottom: 0; width: 200px; height: 100px"
      document.body.append(frame)
    })
    await trigger(page).click()
    await expect(dialog(page)).toBeVisible()
    await page
      .frameLocator('iframe[title="Embedded"]')
      .getByRole("button", { name: "Inside" })
      .click()
    await expect(dialog(page)).toBeHidden()
  })

  test("an infinite exit animation still unmounts", async ({ page, open }) => {
    await open("popover", { animate: "infinite" })
    await trigger(page).click()
    await expect(dialog(page)).toBeVisible()
    await trigger(page).click()
    await expect(page.getByRole("dialog")).toHaveCount(0, { timeout: 1000 })
  })
})

test.describe("shortcuts", { tag: "@enhancement" }, () => {
  const hint = (button: Locator) =>
    button.locator("[data-slot=popover-shortcut]")
  const remoteTrigger = (page: Page) =>
    page.getByRole("button", { name: f.shortcut.remote.trigger, exact: true })

  test.beforeEach(async ({ open }) => {
    await open("popover", { shortcut: "" })
  })

  test("a trigger's shortcut opens and closes the popover", async ({
    page,
  }) => {
    await page.keyboard.press("ControlOrMeta+i")
    await expect(dialog(page)).toBeVisible()
    await expect(field(page)).toBeFocused()
    await page.keyboard.press("ControlOrMeta+i")
    await expect(dialog(page)).toHaveCount(0)
  })

  test("the trigger advertises its shortcut, and its Shortcut part shows the keys to sighted users only", async ({
    page,
  }) => {
    const { aria, text } = await shortcutKeys(page, "I")
    await expect(trigger(page)).toHaveAttribute("aria-keyshortcuts", aria)
    await expect(hint(trigger(page))).toHaveAttribute("aria-hidden", "true")
    await expect(hint(trigger(page))).toHaveText(text)
    await expect(
      page.getByRole("button", { name: f.trigger, exact: true })
    ).toBeVisible()
  })

  test("a Shortcut part shows its own keys", async ({ page }) => {
    await trigger(page).click()
    const save = page.getByRole("button", { name: f.action, exact: true })
    await expect(hint(save)).toHaveAttribute("aria-hidden", "true")
    await expect(hint(save)).toHaveText((await shortcutKeys(page, "S")).text)
  })

  test("a trigger connected through a controller shows and binds its own shortcut", async ({
    page,
  }) => {
    const { aria, text } = await shortcutKeys(page, "E")
    await expect(remoteTrigger(page)).toHaveAttribute("aria-keyshortcuts", aria)
    await expect(hint(remoteTrigger(page))).toHaveText(text)
    await page.keyboard.press("ControlOrMeta+e")
    await expect(dialog(page)).toBeVisible()
  })
})

test.describe("web components", () => {
  test.beforeEach(({ framework }) => {
    test.skip(framework !== "web", "Web component markup only.")
  })

  test(
    "a title added after the popover connects names it",
    { tag: "@enhancement" },
    async ({ page, open }) => {
      await open("popover", { untitled: "" })
      await page.evaluate(() => {
        const title = Object.assign(
          document.createElement("ui-popover-title"),
          { textContent: "Renamed" }
        )
        document.querySelector("ui-popover-content")!.prepend(title)
      })
      await trigger(page).click()
      await expect(page.getByRole("dialog", { name: "Renamed" })).toBeVisible()
    }
  )

  test(
    "changing an attribute updates the part",
    { tag: "@enhancement" },
    async ({ page, open }) => {
      await open("popover")
      await page.evaluate(() =>
        document
          .querySelector("ui-popover-content")!
          .setAttribute("initial-focus", "none")
      )
      await trigger(page).focus()
      await page.keyboard.press("Enter")
      await expect(dialog(page)).toBeVisible()
      await page.waitForTimeout(100)
      await expect(trigger(page)).toBeFocused()
    }
  )
})
