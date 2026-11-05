import { test as base, type Page } from "@playwright/test"

// The docs show each example's prerendered HTML, inert, until its code mounts
// in its place. Specs act on the live example, so a visit waits for all of them.
const live = (page: Page) => page.waitForFunction(() => !document.querySelector("[data-example] > [inert]"))

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
