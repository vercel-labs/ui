import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"
import { autocompleteFixture } from "../fixtures/autocomplete"
import { screenReaderTap } from "../fixtures/screen-reader"

// Parts render as any element, through `render` in React, the `render`
// slot in Vue, and `as-child` on web components.

const input = (page: Page) => page.getByRole("combobox", { name: "Fruit" })

test.describe("custom rendering", () => {
  test.beforeEach(async ({ open }) => {
    await open("autocomplete-render")
  })

  test("a suggestion rendered as a link keeps its role and follows the link on Enter", async ({
    page,
  }) => {
    await input(page).focus()
    await page.keyboard.press("ArrowDown")
    await expect(page.getByRole("option", { name: "Docs" })).toHaveAttribute(
      "data-highlighted",
      ""
    )
    await page.keyboard.press("Enter")
    await expect(page).toHaveURL(/#docs$/)
    await expect(input(page)).toHaveValue("Docs")
  })

  test(
    "Enter follows a link suggestion that a screen reader's tap focused",
    { tag: "@enhancement" },
    async ({ page, browserName }) => {
      test.skip(
        browserName !== "chromium",
        "The tap is sent through the DevTools protocol."
      )
      await screenReaderTap(
        page,
        page.getByRole("button", { name: autocompleteFixture.trigger })
      )
      await expect(page.getByRole("option", { name: "Docs" })).toBeFocused()
      await page.keyboard.press("Enter")
      await expect(page).toHaveURL(/#docs$/)
      await expect(input(page)).toHaveValue("Docs")
    }
  )

  test("render functions receive the part's state", async ({
    page,
    framework,
  }) => {
    test.skip(
      framework.startsWith("web"),
      "Web components style state through attributes."
    )
    await input(page).focus()
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("ArrowDown")
    await expect(page.getByRole("option", { name: "Apple ←" })).toBeVisible()
  })

  test("class names follow the part's state", async ({ page, framework }) => {
    test.skip(
      framework.startsWith("web"),
      "Web components style state through attributes."
    )
    await expect(input(page)).toHaveClass(/is-closed/)
    await input(page).fill("a")
    await expect(input(page)).toHaveClass(/is-open/)
  })
})
