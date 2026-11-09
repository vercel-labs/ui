import { expect, lastAction, test } from "../fixtures"

// Parts render as any element, through `render` in React, the `render`
// slot in Vue. Custom elements are the parts themselves. One fixture
// covers Slider and Number Input.
test.describe("custom rendering", () => {
  test.beforeEach(async ({ open }) => {
    await open("slider-render")
  })

  test("a thumb rendered as a span keeps its slider and its keys", async ({
    page,
    framework,
  }) => {
    const thumb = page.getByRole("slider", { name: "Brightness" })
    if (!framework.startsWith("web")) {
      expect(await thumb.evaluate((el) => el.parentElement!.tagName)).toBe(
        "SPAN"
      )
    }
    await thumb.focus()
    await page.keyboard.press("ArrowRight")
    await expect(thumb).toHaveValue("41")
    expect(await lastAction(page)).toBe("brightness:41")
  })

  test("render functions receive the part's state", async ({
    page,
    framework,
  }) => {
    test.skip(
      framework.startsWith("web"),
      "Web components style state through attributes."
    )
    await expect(page.locator(".slider-value")).toHaveText("Brightness 40")
    await expect(page.locator(".thumb-label")).toHaveText("40")
    await page.getByRole("slider", { name: "Brightness" }).focus()
    await page.keyboard.press("End")
    await expect(page.locator(".thumb-label")).toHaveText("100")
    await expect(page.locator(".slider-value")).toHaveText("Brightness 100")
  })

  test("a number input button renders from its state", async ({
    page,
    framework,
  }) => {
    test.skip(
      framework.startsWith("web"),
      "Web components style state through attributes."
    )
    const more = page.getByRole("button", { name: "Increase count" })
    await expect(more).toHaveText("More")
    await more.click()
    await expect(more).toHaveText("At most")
    await expect(page.getByRole("textbox", { name: "Count" })).toHaveValue("9")
  })

  test("class names and styles follow the part's state", async ({
    page,
    framework,
  }) => {
    test.skip(
      !framework.startsWith("react"),
      "Class functions are React only. Vue uses slot state."
    )
    const indicator = page.locator(".slider-indicator")
    await expect(indicator).toHaveClass(/is-idle/)
    const box = (await page.locator(".slider-thumb").boundingBox())!
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.down()
    await page.mouse.move(box.x + 30, box.y + box.height / 2, { steps: 3 })
    await expect(indicator).toHaveClass(/is-dragging/)
    // A style function survives the part's own inline styles.
    await expect(indicator).toHaveCSS("opacity", "0.5")
    await page.mouse.up()
    await expect(indicator).toHaveClass(/is-idle/)
  })
})
