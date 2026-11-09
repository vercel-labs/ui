import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// Behavior past the WAI-ARIA pattern, tagged `@enhancement`.

const link = (page: Page) => page.getByRole("link", { name: "@ada" })
const card = (page: Page) =>
  page.getByText("Wrote the first program for the Analytical Engine.")
const profileLink = (page: Page) =>
  page.getByRole("link", { name: "View profile" })
const before = (page: Page) => page.getByRole("button", { name: "Before" })

test.describe("enhancements", { tag: "@enhancement" }, () => {
  // Fake timers, so a check that nothing happens runs the time ahead instead of waiting it out.
  test.beforeEach(async ({ page, open }) => {
    await page.clock.install()
    await open("hover-card")
  })

  test("Tab from the link moves into the open card", async ({ page, tab }) => {
    await before(page).focus()
    await tab()
    await expect(card(page)).toBeVisible()
    await tab()
    await expect(profileLink(page)).toBeFocused()
    await expect(card(page)).toBeVisible()
  })

  test("Shift+Tab from the card returns to the link", async ({ page, tab }) => {
    await before(page).focus()
    await tab()
    await expect(card(page)).toBeVisible()
    await tab()
    await expect(profileLink(page)).toBeFocused()
    await tab({ shift: true })
    await expect(link(page)).toBeFocused()
  })

  test("Tab out of the card moves on past the link and closes it", async ({
    page,
    tab,
  }) => {
    await before(page).focus()
    await tab()
    await expect(card(page)).toBeVisible()
    await tab()
    await expect(profileLink(page)).toBeFocused()
    await tab()
    await expect(page.getByRole("button", { name: "After" })).toBeFocused()
    await expect(card(page)).toBeHidden()
  })

  test("Escape inside the card closes it and returns focus to the link", async ({
    page,
    tab,
  }) => {
    await before(page).focus()
    await tab()
    await expect(card(page)).toBeVisible()
    await tab()
    await expect(profileLink(page)).toBeFocused()
    await page.keyboard.press("Escape")
    await expect(card(page)).toBeHidden()
    await expect(link(page)).toBeFocused()
  })

  test("the card stays open while focus is in it, even when the pointer leaves", async ({
    page,
  }) => {
    await link(page).hover()
    await expect(card(page)).toBeVisible()
    await profileLink(page).hover()
    await profileLink(page).focus()
    await page.mouse.move(5, 5, { steps: 4 })
    await page.clock.runFor(400)
    await expect(card(page)).toBeVisible()
  })
})
