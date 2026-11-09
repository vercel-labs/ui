import { expect, lastAction, test } from "../fixtures"

// Parts render as any element, through `render` in React, the `render`
// slot in Vue. Custom elements are the control themselves.
test.describe("custom rendering", () => {
  test.beforeEach(async ({ open }) => {
    await open("forms-render")
  })

  test("a checkbox rendered as a span is still a checkbox, and Space toggles it", async ({
    page,
  }) => {
    const box = page.getByRole("checkbox", { name: "Rendered as a span" })
    expect(await box.evaluate((el) => el.tagName)).not.toBe("BUTTON")
    await box.focus()
    await page.keyboard.press(" ")
    await expect(box).toBeChecked()
    expect(await lastAction(page)).toBe("span:true")
    await page.keyboard.press("Enter")
    await expect(box).toBeChecked()
  })

  test("clicking the label of a checkbox rendered as a span toggles it", async ({
    page,
  }) => {
    await page.getByText("Rendered as a span").click()
    await expect(
      page.getByRole("checkbox", { name: "Rendered as a span" })
    ).toBeChecked()
  })

  test("radios rendered as spans keep arrow keys and selection", async ({
    page,
  }) => {
    const small = page.getByRole("radio", { name: "Small" })
    await small.focus()
    await page.keyboard.press("ArrowDown")
    await expect(page.getByRole("radio", { name: "Large" })).toBeFocused()
    await expect(page.getByRole("radio", { name: "Large" })).toBeChecked()
    expect(await lastAction(page)).toBe("size:large")
    await page.keyboard.press(" ")
    await expect(page.getByRole("radio", { name: "Large" })).toBeChecked()
  })

  test("render functions receive the part's state", async ({
    page,
    framework,
  }) => {
    test.skip(
      framework.startsWith("web"),
      "Web components style state through attributes."
    )
    const box = page.getByRole("checkbox", { name: "Render function" })
    await expect(box).toHaveText("Off")
    await box.click()
    await expect(box).toHaveText("On")
    const thumb = page.getByRole("switch", { name: "Labelled thumb" })
    await expect(thumb).toContainText("I")
    await thumb.click()
    await expect(thumb).toContainText("O")
  })

  test("class names follow the part's state", async ({ page, framework }) => {
    test.skip(
      !framework.startsWith("react") && !framework.startsWith("solid"),
      "Class functions are React and Solid only. Vue uses slot state."
    )
    const box = page.getByRole("checkbox", { name: "Class from state" })
    await expect(box).toHaveClass(/is-unchecked/)
    await box.click()
    await expect(box).toHaveClass(/is-checked/)
  })

  test("a controlled field control keeps every keystroke", async ({
    page,
    framework,
  }) => {
    test.skip(
      framework.startsWith("web"),
      "Custom elements don't control inputs."
    )
    const nickname = page.getByRole("textbox", { name: "Nickname" })
    await nickname.click()
    await page.keyboard.type("Grace", { delay: 20 })
    await expect(nickname).toHaveValue("Grace")
  })
})
