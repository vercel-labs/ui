import { expect, test } from "../fixtures"
import { center, drag, panel, sidebarHandle } from "./resizable.helpers"

// Behavior past the WAI-ARIA pattern, tagged `@enhancement`.
test.describe("enhancements", () => {
  test.beforeEach(async ({ open }) => {
    await open("resizable")
  })

  test(
    "a collapsed panel's content leaves the tab order",
    { tag: "@enhancement" },
    async ({ page, tab }) => {
      await sidebarHandle(page).focus()
      await page.keyboard.press("Enter")
      await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "0")
      await page.getByRole("button", { name: "Before" }).focus()
      await tab()
      await expect(sidebarHandle(page)).toBeFocused()
      await expect(panel(page, "Sidebar")).toHaveAttribute("inert")
    }
  )

  test(
    "focus stays where it was during a drag",
    { tag: "@enhancement" },
    async ({ page }) => {
      const before = page.getByRole("button", { name: "Before" })
      await before.focus()
      await drag(page, await center(sidebarHandle(page)), { x: 40 })
      await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "30")
      await expect(before).toBeFocused()
    }
  )
})
