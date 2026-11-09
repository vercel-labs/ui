import { expect, test } from "../fixtures"
import {
  box,
  scrollOf,
  setScroll,
  settle,
  thumb,
  viewport,
} from "./scroll-area.helpers"

// Parts render as any element, through `render` in React and Vue, and
// render functions receive the part's state.

const renders = (page: import("@playwright/test").Page) =>
  page.evaluate(
    () => (window as unknown as { renders: { root: number } }).renders.root
  )

test.beforeEach(async ({ open }) => {
  await open("scroll-area-render")
})

test("parts rendered as other elements keep scrolling and their scrollbar", async ({
  page,
}) => {
  expect(await viewport(page, "Notes").evaluate((el) => el.tagName)).toBe(
    "ARTICLE"
  )
  expect(
    await viewport(page, "Notes").evaluate((el) => el.parentElement!.tagName)
  ).toBe("SECTION")
  const before = await box(thumb(page, "Notes"))
  await setScroll(viewport(page, "Notes"), { top: 200 })
  await expect
    .poll(async () => (await box(thumb(page, "Notes"))).y)
    .toBeGreaterThan(before.y)
})

test("render functions receive the scroll state", async ({ page }) => {
  await expect(page.locator(".render-status")).toHaveText("Reading")
  await setScroll(viewport(page, "Notes"), { top: 1e6 })
  await expect(page.locator(".render-status")).toHaveText("At end")
})

test(
  "scrolling between the edges renders nothing",
  { tag: "@enhancement" },
  async ({ page }) => {
    await setScroll(viewport(page, "Notes"), { top: 100 })
    await page.waitForTimeout(300)
    const before = await renders(page)
    await viewport(page, "Notes").hover()
    for (let step = 0; step < 4; step++) {
      await page.mouse.wheel(0, 60)
      await settle(page)
    }
    await page.waitForTimeout(300)
    const { top, maxTop } = await scrollOf(viewport(page, "Notes"))
    expect(top).toBeGreaterThan(100)
    expect(top).toBeLessThan(maxTop)
    expect(await renders(page)).toBe(before)
  }
)
