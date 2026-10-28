import type { Page } from "@playwright/test"
import { expect, test, waitForStill } from "../fixtures"

// A Content Security Policy without 'unsafe-inline' blocks every <style>
// element that doesn't carry its nonce. ui-sdk's styles take the nonce from
// the page's `<meta property="csp-nonce">`, or come from constructed style
// sheets, which no policy blocks, when the tag has no nonce. Those are
// adopted after the page's own styles, so there the page declares
// `@layer ui-sdk` first to keep it the lowest layer.

const policies = [
  {
    name: "a nonce",
    policy: "style-src 'self' 'nonce-ui-sdk' 'report-sample'",
    meta: '<meta property="csp-nonce" nonce="ui-sdk">',
    layers: "",
  },
  {
    name: "no nonce",
    policy: "style-src 'self' 'report-sample'",
    meta: '<meta property="csp-nonce">',
    layers: "@layer ui-sdk;",
  },
]

// Serves the fixture page with the policy, the meta tag and a stylesheet of
// the page's own, and records every style the policy blocks, except the ones
// Vite's development server adds for the playground's own CSS.
async function serve(page: Page, { policy, meta, css = "" }: { policy: string; meta: string; css?: string }) {
  await page.route("**/page-styles.css", (route) => route.fulfill({ contentType: "text/css", body: css }))
  await page.route(
    (url) => url.pathname === "/" && url.searchParams.has("fixture"),
    async (route) => {
      const response = await route.fetch()
      const head = `<head>${meta}<link rel="stylesheet" href="/page-styles.css">`
      await route.fulfill({
        response,
        body: (await response.text()).replace("<head>", head),
        headers: { ...response.headers(), "content-security-policy": policy },
      })
    },
  )
  await page.addInitScript(() => {
    const blocked: string[] = []
    Object.assign(window, { blockedStyles: blocked })
    document.addEventListener("securitypolicyviolation", (event) => {
      if (event.target instanceof Element && event.target.hasAttribute("data-vite-dev-id")) return
      blocked.push(`${event.effectiveDirective}: ${event.sample || event.blockedURI}`)
    })
  })
}

const blockedStyles = (page: Page) =>
  page.evaluate(() => (window as unknown as { blockedStyles: string[] }).blockedStyles)

const backdropColor = (page: Page) =>
  page
    .getByRole("listbox")
    .evaluate((el) => getComputedStyle(el.parentElement!, "::backdrop").backgroundColor)

for (const { name, policy, meta, layers } of policies) {
  test.describe(`under a policy with ${name} for styles`, () => {
    test.beforeEach(({ framework }) => {
      test.skip(
        framework.endsWith("-ssr"),
        "Server markup writes style attributes, like a select's hidden input's, which the policy blocks too.",
      )
    })

    test("a modal dialog locks scrolling, and contains overscroll on iOS", async ({ page, open }) => {
      await serve(page, { policy, meta })
      await page.addInitScript(() =>
        Object.defineProperty(Navigator.prototype, "platform", { get: () => "iPhone" }),
      )
      await open("dialog")
      await page.getByRole("button", { name: "Edit profile" }).click()
      const dialog = page.getByRole("dialog", { name: "Profile settings" })
      await expect(dialog).toBeVisible()
      expect(await page.evaluate(() => getComputedStyle(document.scrollingElement!).overflow)).toBe("hidden")
      expect(await dialog.evaluate((el) => getComputedStyle(el).overscrollBehaviorY)).toBe("contain")
      expect(await blockedStyles(page)).toEqual([])
    })

    test("a select opens its list, and hides it again once closed", async ({ page, open }) => {
      await serve(page, { policy, meta })
      await open("select")
      await page.getByRole("combobox", { name: "Fruit" }).click()
      await expect(page.getByRole("listbox")).toBeVisible()
      await page.getByRole("option", { name: "Banana" }).click()
      await expect(page.getByRole("listbox")).toBeHidden()
      await expect(page.getByRole("combobox", { name: "Fruit" })).toHaveText(/Banana/)
      expect(await blockedStyles(page)).toEqual([])
    })

    test("a select presented as a sheet dims the page behind it", async ({ page, open }) => {
      await serve(page, { policy, meta })
      await open("select", { presentation: "sheet" })
      await page.getByRole("combobox", { name: "Fruit" }).click()
      await expect(page.getByRole("listbox")).toBeVisible()
      await waitForStill(page.getByRole("listbox"))
      expect(await backdropColor(page)).toBe("rgba(0, 0, 0, 0.2)")
      expect(await blockedStyles(page)).toEqual([])
    })

    test("the page's own cascade layers win over ui-sdk's styles", async ({ page, open }) => {
      await serve(page, {
        policy,
        meta,
        css: `${layers} @layer page { :where([data-slot])::backdrop { background: rgb(255 0 0 / 0.5) } }`,
      })
      await open("select", { presentation: "sheet" })
      await page.getByRole("combobox", { name: "Fruit" }).click()
      await expect(page.getByRole("listbox")).toBeVisible()
      expect(await backdropColor(page)).toBe("rgba(255, 0, 0, 0.5)")
      expect(await blockedStyles(page)).toEqual([])
    })
  })
}
