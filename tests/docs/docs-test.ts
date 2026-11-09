import { test as base, type Page } from "@playwright/test"

// The docs show each example's prerendered HTML, inert, until it nears the
// viewport and its code mounts in its place. Specs act on the live example, so
// a visit scrolls to each one and waits for all of them.
const live = async (page: Page) => {
  const waiting = page.locator("[data-example] > [inert]")
  if (!(await waiting.count())) {
    return
  }
  const top = await page.evaluate(() => window.scrollY)
  await page.waitForFunction(() => {
    const waiting = document.querySelector("[data-example] > [inert]")
    waiting?.scrollIntoView({ block: "center" })
    return !waiting
  })
  await page.evaluate((y) => window.scrollTo(0, y), top)
}

const test = base.extend({
  page: async ({ page }, use) => {
    const goto = page.goto.bind(page)
    page.goto = async (url, options) => {
      const response = await goto(url, options)
      await live(page)
      return response
    }
    await use(page)
  },
})

export { test }
