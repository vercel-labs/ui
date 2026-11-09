import { buttonNamed, expect, lastAction, test } from "../fixtures"

// A toggle button, from the WAI-ARIA button pattern:
// https://www.w3.org/WAI/ARIA/apg/patterns/button/

test.beforeEach(async ({ open }) => {
  await open("toggle")
})

test("a toggle starts unpressed", async ({ page }) => {
  await expect(buttonNamed(page, "Bookmark")).toHaveAttribute(
    "aria-pressed",
    "false"
  )
})

test("clicking a toggle presses it, and clicking again unpresses it", async ({
  page,
}) => {
  const bookmark = buttonNamed(page, "Bookmark")
  await bookmark.click()
  await expect(bookmark).toHaveAttribute("aria-pressed", "true")
  expect(await lastAction(page)).toBe("bookmark: on")
  await bookmark.click()
  await expect(bookmark).toHaveAttribute("aria-pressed", "false")
  expect(await lastAction(page)).toBe("bookmark: off")
})

for (const key of [" ", "Enter"]) {
  test(`${key} presses a focused toggle`, async ({ page }) => {
    const bookmark = buttonNamed(page, "Bookmark")
    await bookmark.focus()
    await page.keyboard.press(key)
    await expect(bookmark).toHaveAttribute("aria-pressed", "true")
  })
}

test("a toggle can start pressed", async ({ page, open }) => {
  await open("toggle", { pressed: "" })
  await expect(buttonNamed(page, "Bookmark")).toHaveAttribute(
    "aria-pressed",
    "true"
  )
})

test("a change can be cancelled", async ({ page, open }) => {
  await open("toggle", { cancel: "bookmark" })
  await buttonNamed(page, "Bookmark").click()
  await expect(buttonNamed(page, "Bookmark")).toHaveAttribute(
    "aria-pressed",
    "false"
  )
  expect(await lastAction(page)).toBe("")
})

test("a toggle keeps its name when it's pressed", async ({ page }) => {
  await buttonNamed(page, "Bookmark").click()
  await expect(buttonNamed(page, "Bookmark")).toHaveAttribute(
    "aria-pressed",
    "true"
  )
})
