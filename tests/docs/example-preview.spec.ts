import { expect, test, type Page } from "@playwright/test"

// Follows a sidebar link, a client-side navigation, so the page's previews
// unmount without a page load. The dev server compiles a page on its first
// visit, which can take longer than the default timeout.
async function leaveFor(page: Page, name: string) {
  await page.getByRole("link", { name, exact: true }).first().click()
  await expect(page).toHaveURL(new RegExp(`/${name.toLowerCase()}$`), { timeout: 30_000 })
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
})

test("a web example's shortcuts stop when it leaves the page", async ({ page }) => {
  await page.goto("/docs/web-components/utilities/shortcuts")
  await expect(page.locator("[data-example]").getByText("Press N or the keys to save.")).toBeVisible()
  // Guide pages list guides, not components.
  await leaveFor(page, "Forms")
  // A shortcut left registered would still take N, and prevent its default.
  await page.evaluate(() =>
    addEventListener(
      "keydown",
      (event) => ((window as unknown as { prevented?: boolean }).prevented = event.defaultPrevented),
      { once: true },
    ),
  )
  await page.keyboard.press("n")
  expect(await page.evaluate(() => (window as unknown as { prevented?: boolean }).prevented)).toBe(false)
})
