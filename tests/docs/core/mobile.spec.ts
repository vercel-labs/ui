import { expect, type Page } from "@playwright/test"
import { test } from "../docs-test"
import { openExamples } from "./behaviors/helpers"

const url = "/docs/core/mobile"

// Headless browsers have no on-screen keyboard, so the visual viewport is one the test can shrink.
async function withKeyboard(page: Page) {
  await page.addInitScript(() => {
    let keyboard = 0
    const visual = new EventTarget()
    Object.defineProperties(visual, {
      width: { get: () => window.innerWidth },
      height: { get: () => window.innerHeight - keyboard },
      offsetTop: { value: 0 },
      offsetLeft: { value: 0 },
      scale: { value: 1 },
    })
    Object.defineProperty(window, "visualViewport", {
      value: visual,
      configurable: true,
    })
    Object.assign(window, {
      openKeyboard: (height: number) => {
        keyboard = height
        visual.dispatchEvent(new Event("resize"))
      },
    })
  })
}

const openKeyboard = (page: Page, height: number) =>
  page.evaluate(
    (height) =>
      (window as unknown as { openKeyboard: (h: number) => void }).openKeyboard(
        height
      ),
    height
  )

test("every example renders without errors", async ({ page }) => {
  const { errors } = await openExamples(page, url)
  await expect(page.locator("[data-example]")).toHaveCount(3)
  expect(errors).toEqual([])
})

test("bind viewport: the console follows the keyboard as it opens and closes", async ({
  page,
}) => {
  await withKeyboard(page)
  await openExamples(page, url)
  const example = page.locator('[data-example="behaviors/viewport-bind"]')
  const keyboard = example
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()
  await example.scrollIntoViewIfNeeded()
  await expect(keyboard).toHaveText(/^Keyboard 0px/)
  // A smaller viewport without a focused field is zoom, not a keyboard.
  await openKeyboard(page, 300)
  await expect(keyboard).toHaveText(/^Keyboard 0px/)
  await openKeyboard(page, 0)
  await page.getByPlaceholder("Tap here on a phone").focus()
  await openKeyboard(page, 300)
  await expect(keyboard).toHaveText(/^Keyboard 300px/)
  await expect(example.locator('[data-slot="stack"]')).toHaveAttribute(
    "data-keyboard",
    ""
  )
  await openKeyboard(page, 0)
  await expect(keyboard).toHaveText(/^Keyboard 0px/)
})

test("avoid keyboard: the pill under the list rises above the keyboard, and settles back when it closes", async ({
  page,
}) => {
  await withKeyboard(page)
  await openExamples(page, url)
  const list = page.getByRole("textbox", { name: "Groceries" })
  const pill = page.locator("p[aria-live]").filter({ hasText: "Saved" })
  await expect(pill).toHaveText("2 items · Saved")
  const gap = () =>
    pill.evaluate((el) =>
      Math.round(window.innerHeight - el.getBoundingClientRect().bottom)
    )
  // Put the pill 40 pixels above the bottom of the screen, where a 300-pixel keyboard covers it, again until the page settles.
  await expect
    .poll(async () => {
      await pill.evaluate((el) =>
        window.scrollBy(
          0,
          el.getBoundingClientRect().bottom - (window.innerHeight - 40)
        )
      )
      return gap()
    })
    .toBe(40)
  // The browser keeps the field in view on its own; the pill needs the lift.
  await list.evaluate((el) =>
    (el as HTMLElement).focus({ preventScroll: true })
  )
  await openKeyboard(page, 300)
  await expect(pill.locator("..")).toHaveAttribute("data-keyboard", "")
  // The example's wrapper keeps 16 pixels between the pill and the keyboard.
  await expect.poll(gap).toBe(316)
  // End scrolls the page on macOS instead of moving the caret.
  await list.evaluate((el: HTMLTextAreaElement) =>
    el.setSelectionRange(el.value.length, el.value.length)
  )
  await list.pressSequentially("\n- eggs")
  await expect(pill).toHaveText("3 items · Saved")
  await openKeyboard(page, 0)
  await expect.poll(gap).toBe(40)
})

test("pointer kind: a mouse hovers, so the details open on hover", async ({
  page,
}) => {
  await openExamples(page, url)
  const button = page.getByRole("button", {
    name: "Shipping (hover for details)",
  })
  await expect(button).toBeVisible()
  await button.hover()
  await expect(
    page.getByRole("status").filter({ hasText: "Free over $50" })
  ).toBeVisible()
})

test.describe("on a phone", () => {
  test.use({ hasTouch: true, isMobile: true })

  test("pointer kind: a finger can't hover, so the details open on tap", async ({
    page,
  }) => {
    await openExamples(page, url)
    const button = page.getByRole("button", {
      name: "Shipping (tap for details)",
    })
    await button.tap()
    await expect(
      page.getByRole("status").filter({ hasText: "Free over $50" })
    ).toBeVisible()
  })
})
