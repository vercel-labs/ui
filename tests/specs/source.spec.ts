import type { Page } from "@playwright/test"
import { collapsibleFixture as fixture } from "../fixtures/collapsible"
import { screenReaderTap } from "../fixtures/screen-reader"
import { expect, test } from "../fixtures"

// Change details say how the user caused a change, beside why: `details.source`.
// Checked on Collapsible, the simplest component that reports it, in every
// framework. Core computes it, so every component reports it the same way.

const trigger = (page: Page) =>
  page.getByRole("button", { name: fixture.trigger, exact: true })
const source = (page: Page) => page.locator('output[aria-label="Last source"]')

test.describe("change source", { tag: "@enhancement" }, () => {
  test.beforeEach(({ framework }) => {
    test.skip(
      framework.endsWith("-ssr"),
      "The server-rendered fixtures don't show the source."
    )
  })

  test("a mouse click reports mouse", async ({ page, open }) => {
    await open("collapsible")
    await trigger(page).click()
    await expect(source(page)).toHaveText("mouse")
  })

  test("Enter reports keyboard", async ({ page, open }) => {
    await open("collapsible")
    await trigger(page).focus()
    await page.keyboard.press("Enter")
    await expect(trigger(page)).toHaveAttribute("aria-expanded", "true")
    await expect(source(page)).toHaveText("keyboard")
  })

  test("Space reports keyboard", async ({ page, open }) => {
    await open("collapsible")
    await trigger(page).focus()
    await page.keyboard.press(" ")
    await expect(trigger(page)).toHaveAttribute("aria-expanded", "true")
    await expect(source(page)).toHaveText("keyboard")
  })

  test("a click from a script reports programmatic", async ({ page, open }) => {
    await open("collapsible")
    await trigger(page).evaluate((el) => (el as HTMLElement).click())
    await expect(source(page)).toHaveText("programmatic")
  })

  test("a controller reports programmatic", async ({ page, open }) => {
    await open("collapsible")
    await page.getByRole("button", { name: fixture.controller }).click()
    await expect(source(page)).toHaveText("programmatic")
  })
})

test.describe("change source on touch screens", { tag: "@enhancement" }, () => {
  test.use({ hasTouch: true })

  test("a tap reports touch", async ({
    page,
    open,
    framework,
    browserName,
  }) => {
    test.skip(
      framework.endsWith("-ssr"),
      "The server-rendered fixtures don't show the source."
    )
    test.skip(
      browserName === "firefox",
      "Firefox doesn't support touch emulation."
    )
    await open("collapsible")
    await trigger(page).tap()
    await expect(source(page)).toHaveText("touch")
  })
})

test.describe(
  "change source from a screen reader",
  { tag: "@enhancement" },
  () => {
    test("a screen reader's tap reports virtual", async ({
      page,
      open,
      framework,
      browserName,
    }) => {
      test.skip(
        framework.endsWith("-ssr"),
        "The server-rendered fixtures don't show the source."
      )
      test.skip(
        browserName !== "chromium",
        "The tap is sent through the DevTools protocol."
      )
      await open("collapsible")
      await screenReaderTap(page, trigger(page))
      await expect(source(page)).toHaveText("virtual")
    })
  }
)
