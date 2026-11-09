import { expect, test } from "../fixtures"

// Parts render as any element, through `render` in React, the `render`
// slot in Vue. Web components wrap native elements instead.
test.describe("custom rendering", () => {
  test.beforeEach(async ({ open }) => {
    await open("form-render")
  })

  test("a legend rendered as another element still names its field set", async ({
    page,
  }) => {
    await expect(
      page.getByRole("group", { name: "Legend as a div" })
    ).toBeVisible()
  })

  test("a render function receives the input's state", async ({ page }) => {
    const box = page.getByRole("textbox", { name: "Render function" })
    await expect(box).toHaveAttribute("data-state", "empty")
    await box.fill("Ada")
    await expect(box).toHaveAttribute("data-state", "filled")
  })

  test("class names follow the part's state", async ({ page, framework }) => {
    test.skip(
      !framework.startsWith("react") && !framework.startsWith("solid"),
      "Class functions are React and Solid only. Vue uses slot state."
    )
    const box = page.getByRole("textbox", { name: "Class from state" })
    await expect(box).toHaveClass(/is-empty/)
    await box.fill("Ada")
    await expect(box).toHaveClass(/is-filled/)
  })

  test("a clear button rendered as a span still clears", async ({ page }) => {
    await page.getByRole("textbox", { name: "Search" }).fill("shoes")
    await page.getByRole("button", { name: "Clear search" }).click()
    await expect(page.getByRole("textbox", { name: "Search" })).toHaveValue("")
  })

  test("a field keeps its text when its parts render again", async ({
    page,
  }) => {
    await page.getByRole("textbox", { name: "Search" }).fill("shoes")
    await page.getByRole("button", { name: /Render again/ }).click()
    await expect(page.getByRole("textbox", { name: "Search" })).toHaveValue(
      "shoes"
    )
  })
})
