import { expect, lastAction, test } from "../fixtures"

// Parts render as any element, through `render` in React, the `render`
// slot in Vue, and `as-child` or the wrapped element on web components.
test.describe("custom rendering", () => {
  test.beforeEach(async ({ open }) => {
    await open("carousel-render")
  })

  const photo = (page: import("@playwright/test").Page, number: number) =>
    page.getByRole("tab", { name: `Photo ${number}`, exact: true })

  test("an indicator rendered as a link is still a tab, and arrow keys follow it", async ({
    page,
  }) => {
    await photo(page, 1).focus()
    await page.keyboard.press("ArrowRight")
    await expect(photo(page, 2)).toBeFocused()
    expect(await photo(page, 2).evaluate((el) => el.tagName)).toBe("A")
    await expect(photo(page, 2)).toHaveAttribute("aria-selected", "true")
    expect(await lastAction(page)).toBe("2")
    await expect(page).toHaveURL(/#photo-2$/)
  })

  test("clicking an indicator rendered as a link follows it and shows its page", async ({
    page,
  }) => {
    await photo(page, 3).click()
    await expect(photo(page, 3)).toHaveAttribute("aria-selected", "true")
    await expect(page).toHaveURL(/#photo-3$/)
    expect(await lastAction(page)).toBe("3")
  })

  test("render functions receive the part's state", async ({
    page,
    framework,
  }) => {
    test.skip(
      framework.startsWith("web"),
      "Web components style state through attributes."
    )
    await page.getByRole("button", { name: "Next photo" }).click()
    await page.getByRole("button", { name: "Next photo" }).click()
    await expect(
      page.getByRole("button", { name: "No more photos" })
    ).toBeVisible()
  })

  test("class names follow the part's state", async ({ page, framework }) => {
    test.skip(
      framework.startsWith("web"),
      "Web components style state through attributes."
    )
    await expect(page.locator(".is-active")).toHaveText("One")
    await page.getByRole("button", { name: "Next photo" }).click()
    await expect(page.locator(".is-active")).toHaveText("Two")
  })
})
