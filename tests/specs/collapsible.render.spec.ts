import { expect, lastAction, test } from "../fixtures"

// Parts render as any element, through `render` in React, the `render`
// slot in Vue, and `as-child` or a wrapped element on web components.
test.describe("custom rendering", () => {
  test.beforeEach(async ({ open }) => {
    await open("collapsible-render")
  })

  test("a trigger rendered as another element is still a button the keyboard toggles", async ({
    page,
    tab,
  }) => {
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    const trigger = page.getByRole("button", { name: "Files" })
    await expect(trigger).toBeFocused()
    expect(await trigger.evaluate((el) => el.tagName)).toBe("DIV")
    await page.keyboard.press("Enter")
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await expect(page.getByText("The files panel.")).toBeVisible()
    expect(await lastAction(page)).toBe("open")
    await page.keyboard.press(" ")
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
  })

  test("a panel rendered as another element keeps its behavior", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Files" }).click()
    const panel = page.locator(".collapsible-panel")
    await expect(panel).toBeVisible()
    expect(await panel.evaluate((el) => el.tagName)).toBe("SECTION")
    await expect(page.getByRole("button", { name: "Files" })).toHaveAttribute(
      "aria-controls",
      (await panel.getAttribute("id"))!
    )
  })

  test("render functions and slots receive the part's state", async ({
    page,
    framework,
  }) => {
    test.skip(
      framework.startsWith("web"),
      "Web components style state through attributes."
    )
    const trigger = page.getByRole("button", { name: "Files" })
    await expect(trigger).toContainText("+")
    await expect(page.locator(".is-closed")).toHaveCount(1)
    await trigger.click()
    await expect(trigger).toContainText("−")
    await expect(page.locator(".is-open")).toHaveCount(1)
  })
})
