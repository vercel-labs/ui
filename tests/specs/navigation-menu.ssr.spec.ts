import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const hydrationErrors = (page: Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors
  )
const serverHTML = (page: Page) =>
  page.evaluate(
    () => (window as unknown as { __serverHTML: string }).__serverHTML
  )

test("a closed menu hydrates without mismatches", async ({ page, open }) => {
  await open("navigation-menu")
  await expect(async () => {
    await page.mouse.move(0, 0)
    await page.getByRole("button", { name: "Products", exact: true }).hover()
    await expect(page.getByRole("link", { name: "Analytics" })).toBeVisible({
      timeout: 500,
    })
  }).toPass()
  expect(await hydrationErrors(page)).toEqual([])
})

test("an open menu hydrates without mismatches and leaves focus alone", async ({
  page,
  open,
}) => {
  await open("navigation-menu", { open: "products" })
  await expect(page.getByRole("link", { name: "Analytics" })).toBeVisible()
  expect(await hydrationErrors(page)).toEqual([])
  expect(
    await page.evaluate(() => document.activeElement === document.body)
  ).toBe(true)
})

test("an open panel is visible before it hydrates", async ({ page, open }) => {
  await open("navigation-menu", { open: "products" })
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { __visibleBeforeHydration: boolean })
          .__visibleBeforeHydration
    )
  ).toBe(true)
})

test("closed panels kept mounted are in the server's HTML", async ({
  page,
  open,
}) => {
  await open("navigation-menu", { "keep-mounted": "" })
  expect(await serverHTML(page)).toContain('href="#engagement"')
  expect(await hydrationErrors(page)).toEqual([])
})

// React renders `hidden` as a boolean on the server. It becomes findable once it hydrates.
test("closed panels kept findable are in the server's HTML, and findable once hydrated", async ({
  page,
  open,
}) => {
  await open("navigation-menu", { "hidden-until-found": "" })
  expect(await serverHTML(page)).toContain('href="#blog"')
  await expect(
    page.locator(".nav-content", { has: page.locator('a[href="#blog"]') })
  ).toHaveAttribute("hidden", "until-found")
  expect(await hydrationErrors(page)).toEqual([])
})
