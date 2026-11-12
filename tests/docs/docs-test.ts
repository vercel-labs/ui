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

// The docs skip rendering offscreen frames with `content-visibility: auto`. A
// frame renders a frame after it scrolls into view, but Playwright scrolls and
// presses in the same one, so the press would hit the frame instead.
const rendered = () => {
  document.addEventListener("DOMContentLoaded", () => {
    const style = document.createElement("style")
    style.textContent = `figure [data-example], article figure > [data-variant],
      article [data-variant="flat"] { content-visibility: visible !important; }`
    document.head.append(style)
  })
}

const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(rendered)
    // Vercel serves the analytics scripts only on its own hosting.
    await page.route("**/_vercel/**", (route) =>
      route.fulfill({ contentType: "text/javascript", body: "" })
    )
    // Next prefetches a Core or Agents page's segments by the URL a link names,
    // but serves that page through a rewrite, so the prefetch 404s. Following
    // the link still renders the page, so a missed prefetch isn't an error.
    await page.route(/[?&]_rsc=/, async (route) => {
      const response = await route.fetch()
      const prefetch = route.request().headers()["next-router-segment-prefetch"]
      await route.fulfill(
        prefetch && response.status() === 404 ? { status: 204 } : { response }
      )
    })
    const goto = page.goto.bind(page)
    page.goto = async (url, options) => {
      const response = await goto(url, options)
      await live(page)
      return response
    }
    await use(page)
    await page.unrouteAll({ behavior: "ignoreErrors" })
  },
})

export { test }
