import type { Page } from "@playwright/test"
import {
  expect,
  lastAction,
  opacityOf,
  pageNow,
  slowTransitions,
  test,
  transitionedIn,
} from "../fixtures"

// A hover card previews what a link leads to, like a profile, while the
// pointer rests on the link or keyboard focus stays on it. The pointer can
// move into the card, and it never takes focus on its own.

const link = (page: Page) => page.getByRole("link", { name: "@ada" })
const card = (page: Page) =>
  page.getByText("Wrote the first program for the Analytical Engine.")
const profileLink = (page: Page) =>
  page.getByRole("link", { name: "View profile" })
const before = (page: Page) => page.getByRole("button", { name: "Before" })

async function moveAway(page: Page) {
  await page.mouse.move(5, 5, { steps: 4 })
}

// Fake timers, so a check that nothing happens runs the time ahead instead of waiting it out.
test.beforeEach(async ({ page, open }) => {
  await page.clock.install()
  await open("hover-card")
})

test.describe("pointer", () => {
  test("resting the pointer on the link opens the card", async ({ page }) => {
    await link(page).hover()
    await expect(card(page)).toBeVisible()
  })

  test("the card waits for its delay before opening", async ({
    page,
    open,
  }) => {
    await open("hover-card", { delay: "500" })
    const start = await pageNow(page)
    await link(page).hover()
    await expect(card(page)).toBeVisible()
    expect((await pageNow(page)) - start).toBeGreaterThanOrEqual(500)
  })

  test("moving the pointer away closes the card after its close delay", async ({
    page,
    open,
  }) => {
    await open("hover-card", { closeDelay: "400" })
    await link(page).hover()
    await expect(card(page)).toBeVisible()
    const start = await pageNow(page)
    await moveAway(page)
    await expect(card(page)).toBeHidden()
    expect((await pageNow(page)) - start).toBeGreaterThanOrEqual(400)
  })

  test("moving the pointer into the card keeps it open", async ({ page }) => {
    await link(page).hover()
    await expect(card(page)).toBeVisible()
    const box = (await profileLink(page).boundingBox())!
    await page.mouse.move(box.x + 4, box.y + box.height / 2, { steps: 8 })
    await page.clock.runFor(300)
    await expect(card(page)).toBeVisible()
  })

  test("opening on hover leaves focus where it was", async ({ page }) => {
    await before(page).focus()
    await link(page).hover()
    await expect(card(page)).toBeVisible()
    await expect(before(page)).toBeFocused()
  })

  test("clicking the link follows it", async ({ page }) => {
    await link(page).click()
    await expect(page).toHaveURL(/#ada$/)
  })
})

test.describe("keyboard", () => {
  test("keyboard focus on the link opens the card after the delay", async ({
    page,
    tab,
  }) => {
    await before(page).focus()
    await tab()
    await expect(link(page)).toBeFocused()
    await expect(card(page)).toBeVisible()
    await expect(link(page)).toBeFocused()
  })

  test("Escape closes the card and leaves focus on the link", async ({
    page,
    tab,
  }) => {
    await before(page).focus()
    await tab()
    await expect(card(page)).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(card(page)).toBeHidden()
    await expect(link(page)).toBeFocused()
  })

  test("Enter follows the link", async ({ page, tab }) => {
    await before(page).focus()
    await tab()
    await page.keyboard.press("Enter")
    await expect(page).toHaveURL(/#ada$/)
  })
})

test.describe("positioning", () => {
  test("the card opens below the link", async ({ page }) => {
    await link(page).hover()
    const content = page.locator(".hover-card")
    await expect(content).toBeVisible()
    const box = (await content.boundingBox())!
    const anchor = (await link(page).boundingBox())!
    expect(box.y).toBeGreaterThanOrEqual(anchor.y + anchor.height - 1)
  })

  test("the card opens on the requested side", async ({ page, open }) => {
    await open("hover-card", { side: "right" })
    await link(page).hover()
    const content = page.locator(".hover-card")
    await expect(content).toBeVisible()
    const box = (await content.boundingBox())!
    const anchor = (await link(page).boundingBox())!
    expect(box.x).toBeGreaterThanOrEqual(anchor.x + anchor.width - 1)
  })
})

test.describe("animation", () => {
  test("the card animates in from its starting style", async ({
    page,
    open,
  }) => {
    await open("hover-card", { animate: "" })
    await slowTransitions(page)
    await link(page).hover()
    await expect(card(page)).toBeVisible()
    expect(await opacityOf(page.locator(".hover-card"))).toBeLessThan(0.5)
  })

  test("the card stays in the page while it animates out", async ({
    page,
    open,
  }) => {
    await open("hover-card", { animate: "", closeDelay: "0" })
    await link(page).hover()
    await expect(card(page)).toBeVisible()
    await transitionedIn(page.locator(".hover-card"))
    await moveAway(page)
    await expect(page.locator("[data-ending-style]")).toHaveCount(1)
    await expect(card(page)).toBeHidden()
  })
})

test.describe("focus, touch and reasons", () => {
  test("a click that focuses the link doesn't open the card from focus", async ({
    page,
    open,
  }) => {
    await open("hover-card", { delay: "2000" })
    await link(page).click()
    await page.clock.runFor(300)
    await expect(card(page)).toBeHidden()
  })

  test("leaving the link before the delay keeps keyboard focus from opening it later", async ({
    page,
    tab,
  }) => {
    await before(page).focus()
    await tab()
    await tab()
    await expect(page.getByRole("button", { name: "After" })).toBeFocused()
    await page.clock.runFor(300)
    await expect(card(page)).toBeHidden()
  })

  test("a tap follows the link without opening the card", async ({
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
    await page.clock.install()
    await page.goto(`/?fixture=hover-card&framework=${framework}&delay=0`)
    await page.locator("body[data-mounted]").waitFor({ state: "attached" })
    await link(page).tap()
    await expect(page).toHaveURL(/#ada$/)
    await page.clock.runFor(200)
    await expect(card(page)).toBeHidden()
    await context.close()
  })

  test("changes report why the card opened and closed", async ({ page }) => {
    await link(page).hover()
    await expect(card(page)).toBeVisible()
    expect(await lastAction(page)).toBe("open: trigger-hover")
    await page.keyboard.press("Escape")
    await expect(card(page)).toBeHidden()
    expect(await lastAction(page)).toBe("close: escape-key")
  })
})
