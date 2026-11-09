import type { Page } from "@playwright/test"
import { expect, shortcutKeys, test } from "../fixtures"
import { tooltipFixture } from "../fixtures/tooltip"

// Behavior past the WAI-ARIA pattern, tagged `@enhancement`.

const save = (page: Page) =>
  page.getByRole("button", { name: "Save", exact: true })
const saveTip = (page: Page) => page.getByText("Save your changes")
const profile = (page: Page) => page.getByRole("button", { name: "Profile" })
const profileTip = (page: Page) => page.getByText("Edit your profile")
const info = (page: Page) => page.getByRole("button", { name: "About billing" })
// The announcer repeats the text, so the tooltip is found by its class.
const infoTip = (page: Page) =>
  page.locator(".tooltip", {
    hasText: "Billing runs on the first of the month.",
  })
const popover = (page: Page) =>
  page.getByRole("dialog", { name: "Profile settings" })

test.describe("enhancements", { tag: "@enhancement" }, () => {
  // Fake timers, so a check that nothing happens runs the time ahead instead of waiting it out.
  test.beforeEach(async ({ page, open }) => {
    await page.clock.install()
    await open("tooltip")
  })

  test("focus returning to the trigger after its popover closes doesn't reopen the tooltip", async ({
    page,
    tab,
  }) => {
    await page.getByRole("button", { name: "Underline" }).focus()
    await tab()
    await expect(profileTip(page)).toBeVisible()
    await page.keyboard.press("Enter")
    await expect(popover(page)).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(popover(page)).toBeHidden()
    await expect(profile(page)).toBeFocused()
    await page.clock.runFor(300)
    await expect(profileTip(page)).toBeHidden()
  })
  test("tooltips open at once after another one, without a provider", async ({
    page,
    open,
  }) => {
    await open("tooltip", { delay: "800" })
    await page.getByRole("button", { name: "Bold" }).hover()
    await expect(page.getByText("Bold", { exact: true })).toBeVisible()
    await page.getByRole("button", { name: "Underline" }).hover()
    await expect(page.getByText("Underline", { exact: true })).toBeVisible({
      timeout: 300,
    })
    await expect(page.getByRole("tooltip")).toHaveAttribute("data-instant", "")
  })
  test("focus coming back with the window doesn't reopen the tooltip", async ({
    page,
    tab,
  }) => {
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(saveTip(page)).toBeVisible()
    await page.evaluate(() => {
      const trigger = document.activeElement as HTMLElement
      trigger.blur()
      window.dispatchEvent(new FocusEvent("blur"))
      trigger.focus()
    })
    await expect(save(page)).toBeFocused()
    await page.clock.runFor(200)
    await expect(saveTip(page)).toBeHidden()
  })

  test("a controller opens the tooltip without moving focus", async ({
    page,
  }) => {
    const button = page.getByRole("button", { name: "Open with controller" })
    await button.focus()
    await page.keyboard.press("Enter")
    await expect(saveTip(page)).toBeVisible()
    await expect(button).toBeFocused()
  })
  test("a trigger that's a disabled button warns in development", async ({
    page,
    open,
  }) => {
    const warnings: string[] = []
    page.on(
      "console",
      (message) => message.type() === "warning" && warnings.push(message.text())
    )
    await open("tooltip", { "native-disabled": "" })
    await expect
      .poll(() => warnings.some((warning) => /disabled button/.test(warning)))
      .toBe(true)
  })
})

test.describe("shortcuts", { tag: "@enhancement" }, () => {
  test("a trigger connected through a controller shows its tooltip's shortcut in a Shortcut part", async ({
    page,
    open,
  }) => {
    await open("tooltip", { shortcut: "" })
    const copy = page.getByRole("button", {
      name: tooltipFixture.shortcut.trigger,
      exact: true,
    })
    const { aria, text } = await shortcutKeys(page, "S")
    await expect(copy).toHaveAttribute("aria-keyshortcuts", aria)
    const hint = copy.locator("[data-slot=tooltip-shortcut]")
    await expect(hint).toHaveAttribute("aria-hidden", "true")
    await expect(hint).toHaveText(text)
  })
})

test.describe("toggleable", { tag: "@enhancement" }, () => {
  test.beforeEach(async ({ page, open }) => {
    await page.clock.install()
    await open("tooltip")
  })

  test("pressing a toggleable trigger opens and closes the tooltip", async ({
    page,
  }) => {
    await info(page).click()
    await expect(infoTip(page)).toBeVisible()
    await page.mouse.move(5, 5, { steps: 4 })
    await page.clock.runFor(200)
    await expect(infoTip(page)).toBeVisible()
    await info(page).click()
    await expect(infoTip(page)).toBeHidden()
  })

  test("pressing outside closes a toggleable tooltip", async ({ page }) => {
    await info(page).click()
    await expect(infoTip(page)).toBeVisible()
    await page.mouse.click(5, 5)
    await expect(infoTip(page)).toBeHidden()
  })

  test("Enter toggles the tooltip from the keyboard and keeps focus on the trigger", async ({
    page,
  }) => {
    await info(page).focus()
    await page.keyboard.press("Escape")
    await expect(infoTip(page)).toBeHidden()
    await page.keyboard.press("Enter")
    await expect(infoTip(page)).toBeVisible()
    await expect(info(page)).toBeFocused()
  })

  test("a press announces the tooltip's text to screen readers", async ({
    page,
  }) => {
    await info(page).click()
    await expect(page.locator("[data-ui-sdk-announcer]")).toHaveText(
      "Billing runs on the first of the month."
    )
  })

  test("a tap opens a toggleable tooltip on a touch screen", async ({
    browser,
    framework,
    baseURL,
  }) => {
    const context = await browser.newContext({
      hasTouch: true,
      isMobile: true,
      baseURL,
    })
    const page = await context.newPage()
    await page.goto(`/?fixture=tooltip&framework=${framework}`)
    await page.locator("body[data-mounted]").waitFor({ state: "attached" })
    await info(page).tap()
    await expect(infoTip(page)).toBeVisible()
    await info(page).tap()
    await expect(infoTip(page)).toBeHidden()
    await context.close()
  })
})
