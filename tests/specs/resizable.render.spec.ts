import { expect, lastAction, test } from "../fixtures"
import { center, handle, panel } from "./resizable.helpers"

const renders = (page: import("@playwright/test").Page) =>
  page.evaluate(
    () =>
      (window as unknown as { panelRenders: { renders: number } }).panelRenders
        .renders
  )

// Parts render as any element, through `render` in React, the `render`
// slot in Vue. Custom elements are the parts themselves.
test.describe("custom rendering", () => {
  test.beforeEach(async ({ open }) => {
    await open("resizable-render")
  })

  test("a handle rendered as a span keeps its separator and its keys", async ({
    page,
    framework,
  }) => {
    const files = handle(page, "Resize files")
    if (!framework.startsWith("web")) {
      expect(await files.evaluate((el) => el.tagName)).toBe("SPAN")
    }
    await files.focus()
    await page.keyboard.press("ArrowRight")
    await expect(files).toHaveAttribute("aria-valuenow", "31")
    expect(await lastAction(page)).toBe("layout:31,69")
  })

  test("render functions receive the part's state", async ({
    page,
    framework,
  }) => {
    test.skip(
      framework.startsWith("web"),
      "Web components style state through attributes."
    )
    await expect(page.locator(".panel-state")).toHaveText("Open")
    await expect(page.locator(".panel-size")).toHaveText("70")
    await handle(page, "Resize files").focus()
    await page.keyboard.press("Enter")
    await expect(page.locator(".panel-state")).toHaveText("Collapsed")
    await expect(page.locator(".panel-size")).toHaveText("100")
  })

  test("a drag doesn't render parts that don't read the size on every frame", async ({
    page,
    framework,
  }) => {
    test.skip(framework.startsWith("web"), "Custom elements never render.")
    await expect(page.locator(".panel-size")).toHaveText("70")
    const width = (await panel(page, "Files").boundingBox())!.width
    const point = await center(handle(page, "Resize files"))
    await page.mouse.move(point.x, point.y)
    await page.mouse.down()
    // The drag starting may render parts once, for `data-dragging`.
    await page.mouse.move(point.x + 8, point.y)
    await expect(page.locator(".panel-size")).toHaveText("69")
    const before = await renders(page)
    await page.mouse.move(point.x + 80, point.y, { steps: 8 })
    expect((await panel(page, "Files").boundingBox())!.width).toBeCloseTo(
      width + 80,
      0
    )
    // The panel that reads its size follows every frame.
    await expect(page.locator(".panel-size")).toHaveText(
      String(Math.round(100 - ((width + 80) / 794) * 100))
    )
    expect(await renders(page)).toBe(before)
    await page.mouse.up()
  })

  test("class names follow the part's state", async ({ page, framework }) => {
    test.skip(
      !framework.startsWith("react"),
      "Class functions are React only. Vue uses slot state."
    )
    const files = handle(page, "Resize files")
    await expect(files).toHaveClass(/is-idle/)
    const point = await center(files)
    await page.mouse.move(point.x, point.y)
    await page.mouse.down()
    await page.mouse.move(point.x + 30, point.y, { steps: 3 })
    await expect(files).toHaveClass(/is-dragging/)
    await page.mouse.up()
    await expect(files).toHaveClass(/is-idle/)
  })
})
