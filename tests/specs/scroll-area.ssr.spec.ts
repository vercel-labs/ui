import { scrollAreaFixture } from "../fixtures/scroll-area"
import { expect, test } from "../fixtures"
import { scrollbar, scrollOf, viewport } from "./scroll-area.helpers"

const { tags, chat } = scrollAreaFixture

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const hydrationErrors = (page: import("@playwright/test").Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors
  )

test("scroll areas hydrate without mismatches, then measure and show their scrollbars", async ({
  page,
  open,
}) => {
  await open("scroll-area")
  await page.waitForLoadState("networkidle")
  await expect(scrollbar(page, tags.label)).toBeVisible()
  expect(await hydrationErrors(page)).toEqual([])
})

test(
  "an area sticking to the end is at the end once hydrated",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("scroll-area")
    await page.waitForLoadState("networkidle")
    await expect
      .poll(async () => {
        const scroll = await scrollOf(viewport(page, chat.label))
        return scroll.maxTop - scroll.top
      })
      .toBeLessThan(1)
    expect(await hydrationErrors(page)).toEqual([])
  }
)
