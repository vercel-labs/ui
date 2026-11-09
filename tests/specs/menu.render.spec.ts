import { expect, lastAction, menuNamed, test } from "../fixtures"

// Parts render as any element, through `render` in React, the `render`
// slot in Vue, and `as-child` on web components.
test.describe("custom rendering", () => {
  test.beforeEach(async ({ open }) => {
    await open("menu-render")
  })

  test("an item rendered as a link is still a menu item, and Enter follows it", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "File" }).focus()
    await page.keyboard.press("Enter")
    const docs = page.getByRole("menuitem", { name: "Docs" })
    await expect(docs).toBeFocused()
    expect(await docs.evaluate((el) => el.tagName)).toBe("A")
    await page.keyboard.press("Enter")
    await expect(menuNamed(page, "File")).toBeHidden()
    expect(await lastAction(page)).toBe("docs")
    await expect(page).toHaveURL(/#docs$/)
  })

  test("clicking an item rendered as a link follows it", async ({ page }) => {
    await page.getByRole("button", { name: "File" }).click()
    await page.getByRole("menuitem", { name: "Docs" }).click()
    await expect(menuNamed(page, "File")).toBeHidden()
    expect(await lastAction(page)).toBe("docs")
    await expect(page).toHaveURL(/#docs$/)
  })

  test("render functions receive the part's state", async ({
    page,
    framework,
  }) => {
    test.skip(
      framework.startsWith("web"),
      "Web components style state through attributes."
    )
    await page.getByRole("button", { name: "File" }).focus()
    await page.keyboard.press("Enter")
    await page.keyboard.press("ArrowDown")
    await expect(page.getByRole("menuitem", { name: "Watched" })).toContainText(
      "→"
    )
    await page.keyboard.press("ArrowDown")
    await expect(
      page.getByRole("menuitem", { name: "Watched" })
    ).not.toContainText("→")
  })

  test("a part re-renders only for the state its render function reads @enhancement", async ({
    page,
    framework,
  }) => {
    test.skip(
      framework.startsWith("web"),
      "Web components have no render functions."
    )
    // The test above shows the arrow follows the highlight there: the expression
    // that reads it updates on its own, so the function's call count stays at one.
    test.skip(
      framework.startsWith("solid"),
      "Solid runs a render function once."
    )
    await page.getByRole("button", { name: "File" }).focus()
    await page.keyboard.press("Enter")
    await expect(page.getByRole("menuitem", { name: "Docs" })).toBeFocused()
    const renders = () =>
      page.evaluate(() => ({ ...(window as any).__renders }))
    const before = await renders()
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press("ArrowDown")
      await page.keyboard.press("ArrowDown")
      await page.keyboard.press("ArrowUp")
      await page.keyboard.press("ArrowUp")
    }
    await expect(page.getByRole("menuitem", { name: "Docs" })).toBeFocused()
    const after = await renders()
    expect(after.watched).toBeGreaterThan(before.watched)
    expect(after.plain).toBe(before.plain)
  })

  test("class names follow the part's state", async ({ page, framework }) => {
    test.skip(
      framework.startsWith("web"),
      "Web components style state through attributes."
    )
    await page.getByRole("button", { name: "File" }).click()
    const pinned = page.getByRole("menuitemcheckbox", { name: "Pinned" })
    await expect(
      pinned.locator("css=:scope, *").and(page.locator(".is-unchecked"))
    ).toHaveCount(1)
    await pinned.click()
    await expect(
      pinned.locator("css=:scope, *").and(page.locator(".is-checked"))
    ).toHaveCount(1)
  })
})
