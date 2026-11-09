import {
  expect,
  lastAction,
  regionNamed,
  test,
  triggerNamed,
} from "../fixtures"

// Parts render as any element, through `render` in React, the `render`
// slot in Vue, and `as-child` or a wrapped element on web components.
test.describe("custom rendering", () => {
  test.beforeEach(async ({ open }) => {
    await open("accordion-render")
  })

  test("a header rendered as another heading level still holds its trigger", async ({
    page,
  }) => {
    const heading = page.getByRole("heading", { name: "Overview", level: 2 })
    await expect(heading).toBeVisible()
    await expect(
      heading.getByRole("button", { name: "Overview" })
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Details", level: 3 })
    ).toBeVisible()
  })

  test("a panel rendered as another element is still a region named by its trigger", async ({
    page,
  }) => {
    const panel = regionNamed(page, "Overview")
    await expect(panel).toBeVisible()
    expect(await panel.evaluate((el) => el.tagName)).toBe("SECTION")
    await triggerNamed(page, "Overview").click()
    await expect(page.getByRole("region")).toHaveCount(0)
  })

  test("a trigger rendered as another element is still a button the keyboard toggles", async ({
    page,
    tab,
  }) => {
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(triggerNamed(page, "Overview")).toBeFocused()
    await tab()
    const details = triggerNamed(page, "Details")
    await expect(details).toBeFocused()
    expect(await details.evaluate((el) => el.tagName)).toBe("DIV")
    await page.keyboard.press("Enter")
    await expect(details).toHaveAttribute("aria-expanded", "true")
    await expect(regionNamed(page, "Details")).toBeVisible()
    expect(await lastAction(page)).toBe("details")
    await page.keyboard.press(" ")
    await expect(details).toHaveAttribute("aria-expanded", "false")
    await details.click()
    await expect(details).toHaveAttribute("aria-expanded", "true")
  })

  test("render functions receive the part's state", async ({
    page,
    framework,
  }) => {
    test.skip(
      framework.startsWith("web"),
      "Web components style state through attributes."
    )
    const overview = triggerNamed(page, "Overview")
    await expect(overview).toContainText("−")
    await overview.click()
    await expect(overview).toContainText("+")
  })

  test("class names follow the part's state", async ({ page, framework }) => {
    test.skip(
      framework.startsWith("web"),
      "Web components style state through attributes."
    )
    await expect(page.locator(".is-open")).toHaveCount(1)
    await triggerNamed(page, "Overview").click()
    await expect(page.locator(".is-open")).toHaveCount(0)
    await expect(page.locator(".is-closed")).toHaveCount(1)
  })

  test("parts report their state through data attributes", async ({ page }) => {
    const overview = triggerNamed(page, "Overview")
    await expect(overview).toHaveAttribute("data-open", "")
    await expect(regionNamed(page, "Overview")).toHaveAttribute("data-open", "")
    await expect(
      page.getByRole("heading", { name: "Overview" })
    ).toHaveAttribute("data-open", "")
    await overview.click()
    await expect(overview).toHaveAttribute("data-closed", "")
    await expect(
      page.getByRole("heading", { name: "Overview" })
    ).toHaveAttribute("data-closed", "")
  })

  test("render functions receive the item's index", async ({
    page,
    framework,
  }) => {
    test.skip(
      framework.startsWith("web"),
      "Web components style state through attributes."
    )
    await expect(page.locator(".index")).toHaveText("0")
  })

  test("items report their position", async ({ page }) => {
    await expect(page.locator(".accordion-item").nth(0)).toHaveAttribute(
      "data-index",
      "0"
    )
    await expect(page.locator(".accordion-item").nth(1)).toHaveAttribute(
      "data-index",
      "1"
    )
  })
})
