import { expect, test } from "../fixtures"
import {
  center,
  drag,
  editorSpace,
  panel,
  previewHandle,
  sidebarHandle,
  sizeOf,
  status,
  terminalHandle,
} from "./resizable.helpers"

// Behavior follows the WAI-ARIA window splitter pattern:
// https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/

test.describe("keyboard", () => {
  test.beforeEach(async ({ open }) => {
    await open("resizable")
  })

  test("starts at each panel's default size, and panels without one share the rest", async ({
    page,
  }) => {
    await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "25")
    await expect(previewHandle(page)).toHaveAttribute("aria-valuenow", "50")
    await expect(terminalHandle(page)).toHaveAttribute("aria-valuenow", "70")
    expect(await sizeOf(panel(page, "Sidebar"))).toBeCloseTo(editorSpace / 4, 0)
    expect(await sizeOf(panel(page, "Main"))).toBeCloseTo(editorSpace / 2, 0)
  })

  test("ArrowRight grows the panel before the handle by one step, and ArrowLeft shrinks it", async ({
    page,
  }) => {
    await sidebarHandle(page).focus()
    await page.keyboard.press("ArrowRight")
    await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "26")
    expect(await status(page, "Last action")).toBe("editor:26,49,25:step-key")
    await page.keyboard.press("ArrowLeft")
    await page.keyboard.press("ArrowLeft")
    await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "24")
  })

  test(
    "Shift with an arrow key moves by the large step",
    { tag: "@enhancement" },
    async ({ page }) => {
      await sidebarHandle(page).focus()
      await page.keyboard.press("Shift+ArrowRight")
      await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "35")
    }
  )

  test("arrows across the group's axis do nothing", async ({ page }) => {
    await sidebarHandle(page).focus()
    await page.keyboard.press("ArrowUp")
    await page.keyboard.press("ArrowDown")
    await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "25")
  })

  test("ArrowDown and ArrowUp move a vertical group's handle", async ({
    page,
  }) => {
    await terminalHandle(page).focus()
    await page.keyboard.press("ArrowDown")
    await expect(terminalHandle(page)).toHaveAttribute("aria-valuenow", "71")
    await page.keyboard.press("ArrowUp")
    await page.keyboard.press("ArrowUp")
    await expect(terminalHandle(page)).toHaveAttribute("aria-valuenow", "69")
  })

  test("Home collapses a collapsible panel, and End grows it to its maximum", async ({
    page,
  }) => {
    await sidebarHandle(page).focus()
    await page.keyboard.press("Home")
    await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "0")
    await page.keyboard.press("End")
    await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "40")
  })

  test("Home stops at the minimum of a panel that can't collapse", async ({
    page,
  }) => {
    await previewHandle(page).focus()
    await page.keyboard.press("Home")
    await expect(previewHandle(page)).toHaveAttribute("aria-valuenow", "30")
  })

  test("Enter collapses the panel before the handle, and restores its size", async ({
    page,
  }) => {
    await sidebarHandle(page).focus()
    await page.keyboard.press("Shift+ArrowRight")
    await page.keyboard.press("Enter")
    await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "0")
    expect(await status(page, "Last action")).toBe("editor:0,75,25:collapse")
    await page.keyboard.press("Enter")
    await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "35")
  })

  test("Enter collapses the panel after the handle when only that one can collapse", async ({
    page,
  }) => {
    await terminalHandle(page).focus()
    await page.keyboard.press("Enter")
    await expect(terminalHandle(page)).toHaveAttribute("aria-valuenow", "100")
    await page.keyboard.press("Enter")
    await expect(terminalHandle(page)).toHaveAttribute("aria-valuenow", "70")
  })

  test("one step past a collapsible panel's minimum collapses it", async ({
    page,
    open,
  }) => {
    await open("resizable", { "default-layout": "15,60,25" })
    await sidebarHandle(page).focus()
    await page.keyboard.press("ArrowLeft")
    await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "0")
    await page.keyboard.press("ArrowRight")
    await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "15")
  })

  test("a panel at its minimum passes the rest on to the next one", async ({
    page,
  }) => {
    await previewHandle(page).focus()
    for (let index = 0; index < 3; index++) {
      await page.keyboard.press("Shift+ArrowLeft")
    }
    await expect(previewHandle(page)).toHaveAttribute("aria-valuenow", "30")
    await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "15")
  })

  test("End stops where the panels' bounds meet", async ({ page }) => {
    await previewHandle(page).focus()
    await page.keyboard.press("End")
    // The preview keeps its 120px minimum.
    expect(await sizeOf(panel(page, "Preview"))).toBeCloseTo(120, 0)
  })

  test("keys pressed without waiting all land", async ({ page }) => {
    await sidebarHandle(page).focus()
    for (let index = 0; index < 5; index++) {
      await page.keyboard.press("ArrowRight")
    }
    await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "30")
  })

  test("keys complete the change once they come up", async ({ page }) => {
    await sidebarHandle(page).focus()
    await page.keyboard.down("ArrowRight")
    await page.keyboard.down("ArrowRight")
    await page.keyboard.up("ArrowRight")
    expect(await status(page, "Committed")).toBe("editor:27,48,25:step-key")
  })

  test(
    "step and large step set how far keys move",
    { tag: "@enhancement" },
    async ({ page, open }) => {
      await open("resizable", { step: "5", "large-step": "12" })
      await sidebarHandle(page).focus()
      await page.keyboard.press("ArrowRight")
      await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "30")
      await page.keyboard.press("Shift+ArrowLeft")
      await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "18")
    }
  )

  test("a canceled change keeps the layout", async ({ page, open }) => {
    await open("resizable", { cancel: "" })
    await sidebarHandle(page).focus()
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("Enter")
    await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "25")
    expect(await sizeOf(panel(page, "Sidebar"))).toBeCloseTo(editorSpace / 4, 0)
  })

  test("a controlled group follows its layout", async ({ page, open }) => {
    await open("resizable", { controlled: "" })
    await sidebarHandle(page).focus()
    await page.keyboard.press("Shift+ArrowRight")
    await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "35")
    await page.keyboard.press("Enter")
    await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "0")
    expect(await status(page, "Committed")).toContain("editor:0,75,25:collapse")
  })

  test("a controlled group that ignores a change completes nothing", async ({
    page,
    open,
    framework,
  }) => {
    test.skip(
      framework.startsWith("web"),
      "A web group's layout attribute sets its state, so it's never controlled."
    )
    await open("resizable", { ignore: "" })
    await sidebarHandle(page).focus()
    await page.keyboard.press("ArrowRight")
    expect(await status(page, "Last action")).toBe("editor:26,49,25:step-key")
    await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "25")
    expect(await status(page, "Committed")).toBe("")
  })

  test("a disabled handle stops a move from the next one, so the panels past it keep their sizes", async ({
    page,
    open,
  }) => {
    await open("resizable", { locked: "" })
    await expect(previewHandle(page)).toHaveAttribute("aria-valuemin", "30")
    await previewHandle(page).focus()
    for (let press = 0; press < 4; press++) {
      await page.keyboard.press("Shift+ArrowLeft")
    }
    await expect(previewHandle(page)).toHaveAttribute("aria-valuenow", "30")
    await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "25")
  })

  test("defaultLayout sets where the panels start", async ({ page, open }) => {
    await open("resizable", { "default-layout": "20,50,30" })
    await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "20")
    await expect(previewHandle(page)).toHaveAttribute("aria-valuenow", "50")
  })

  test("a disabled group's handles leave the tab order and ignore drags", async ({
    page,
    open,
    tab,
  }) => {
    await open("resizable", { disabled: "" })
    await expect(sidebarHandle(page)).not.toHaveAttribute("tabindex")
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(
      page.getByRole("button", { name: "Sidebar action" })
    ).toBeFocused()
    await drag(page, await center(sidebarHandle(page)), { x: 80 })
    await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "25")
  })
})

test.describe("pointer", () => {
  test.beforeEach(async ({ open }) => {
    await open("resizable")
  })

  test("dragging a handle moves it with the pointer", async ({ page }) => {
    const before = await sizeOf(panel(page, "Sidebar"))
    await drag(page, await center(sidebarHandle(page)), { x: 60 })
    expect(await sizeOf(panel(page, "Sidebar"))).toBeCloseTo(before + 60, 0)
    expect(await sizeOf(panel(page, "Main"))).toBeCloseTo(
      editorSpace / 2 - 60,
      0
    )
  })

  test("a drag reports its moves with the drag reason and completes once", async ({
    page,
  }) => {
    await drag(page, await center(sidebarHandle(page)), {
      x: Math.round(editorSpace / 10),
    })
    expect(await status(page, "Last action")).toBe("editor:35,40,25:drag")
    expect(await status(page, "Committed")).toBe("editor:35,40,25:drag")
  })

  test("dragging past a disabled handle moves nothing beyond it", async ({
    page,
    open,
  }) => {
    await open("resizable", { locked: "" })
    await drag(page, await center(previewHandle(page)), {
      x: -Math.round(editorSpace / 2),
    })
    await expect(previewHandle(page)).toHaveAttribute("aria-valuenow", "30")
    await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "25")
  })

  test("dragging a vertical group's handle moves it up and down", async ({
    page,
  }) => {
    const before = await sizeOf(panel(page, "Code"), "height")
    await drag(page, await center(terminalHandle(page)), { y: -40 })
    expect(await sizeOf(panel(page, "Code"), "height")).toBeCloseTo(
      before - 40,
      0
    )
  })

  test("dragging past half a collapsible panel's minimum collapses it, and back opens it", async ({
    page,
  }) => {
    const start = await center(sidebarHandle(page))
    await page.mouse.move(start.x, start.y)
    await page.mouse.down()
    // 25% to 16%: still open, at least the 15% minimum.
    await page.mouse.move(start.x - 9 * 7.94, start.y, { steps: 4 })
    await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "16")
    // 25% to 6%: past half the way to collapsed.
    await page.mouse.move(start.x - 19 * 7.94, start.y, { steps: 4 })
    await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "0")
    await page.mouse.move(start.x - 15 * 7.94, start.y, { steps: 4 })
    await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "15")
    await page.mouse.up()
  })

  test("a drag stops at the panels' bounds", async ({ page }) => {
    await drag(page, await center(sidebarHandle(page)), { x: 300 })
    await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "40")
  })

  test("a double-click on a handle collapses its panel, and another restores it", async ({
    page,
  }) => {
    const point = await center(sidebarHandle(page))
    await page.mouse.dblclick(point.x, point.y)
    await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "0")
    expect(await status(page, "Committed")).toContain("editor:0,75,25:collapse")
    const collapsed = await center(sidebarHandle(page))
    await page.mouse.dblclick(collapsed.x, collapsed.y)
    await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "25")
  })

  test("a press just beside the thin handle drags it", async ({ page }) => {
    const box = (await sidebarHandle(page).boundingBox())!
    await drag(page, { x: box.x + box.width + 3, y: box.y + 100 }, { x: 40 })
    expect(await sizeOf(panel(page, "Sidebar"))).toBeCloseTo(
      editorSpace / 4 + 40,
      0
    )
  })

  test("a press farther from the handle doesn't drag", async ({ page }) => {
    const box = (await sidebarHandle(page).boundingBox())!
    await drag(page, { x: box.x + box.width + 12, y: box.y + 100 }, { x: 40 })
    await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "25")
  })

  test("where two handles meet, one drag moves both", async ({ page }) => {
    const outer = (await sidebarHandle(page).boundingBox())!
    const inner = (await terminalHandle(page).boundingBox())!
    const sidebar = await sizeOf(panel(page, "Sidebar"))
    const code = await sizeOf(panel(page, "Code"), "height")
    await drag(
      page,
      { x: outer.x + outer.width / 2, y: inner.y + inner.height / 2 },
      { x: 30, y: 30 }
    )
    expect(await sizeOf(panel(page, "Sidebar"))).toBeCloseTo(sidebar + 30, 0)
    expect(await sizeOf(panel(page, "Code"), "height")).toBeCloseTo(
      code + 30,
      0
    )
  })

  test("a drag shows the axis cursor over the whole page until it ends", async ({
    page,
  }) => {
    const point = await center(sidebarHandle(page))
    const cursor = () =>
      page.evaluate(
        () => getComputedStyle(document.querySelector("output")!).cursor
      )
    await page.mouse.move(point.x, point.y)
    await page.mouse.down()
    await page.mouse.move(point.x + 20, point.y, { steps: 2 })
    expect(await cursor()).toBe("ew-resize")
    await page.mouse.up()
    await page.mouse.move(0, 0)
    await expect.poll(cursor).toBe("auto")
  })
})

test.describe("controller", () => {
  test.beforeEach(async ({ open }) => {
    await open("resizable")
  })

  test("collapses and expands a panel, with the imperative reason", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Collapse sidebar" }).click()
    await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "0")
    expect(await status(page, "Last action")).toBe("editor:0,75,25:imperative")
    await page.getByRole("button", { name: "Expand sidebar" }).click()
    await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "25")
  })

  test("resizes a panel to a size in pixels", async ({ page }) => {
    await page.getByRole("button", { name: "Resize preview" }).click()
    await expect.poll(() => sizeOf(panel(page, "Preview"))).toBeCloseTo(200, 0)
  })
})

test.describe("container", () => {
  test("a panel with a minimum in pixels keeps it as the group shrinks", async ({
    page,
    open,
  }) => {
    await open("resizable")
    await previewHandle(page).focus()
    await page.keyboard.press("End")
    expect(await sizeOf(panel(page, "Preview"))).toBeCloseTo(120, 0)
    await page.evaluate(() => {
      document.querySelector<HTMLElement>(
        '[data-slot="resizable-root"]'
      )!.style.width = "600px"
    })
    await expect.poll(() => sizeOf(panel(page, "Preview"))).toBeCloseTo(120, 0)
    expect(await status(page, "Last action")).toMatch(/:resize$/)
  })

  test("panels keep their share as the group grows", async ({ page, open }) => {
    await open("resizable")
    await page.evaluate(() => {
      document.querySelector<HTMLElement>(
        '[data-slot="resizable-root"]'
      )!.style.width = "1000px"
    })
    await expect
      .poll(() => sizeOf(panel(page, "Sidebar")))
      .toBeCloseTo((1000 - 6) / 4, 0)
  })
})

test.describe("pages around a group", () => {
  test.beforeEach(async ({ open }) => {
    await open("resizable")
  })

  test("a layer above a handle keeps its presses", async ({ page }) => {
    await page.evaluate(() => {
      const layer = document.createElement("div")
      layer.style.cssText =
        "position:fixed;inset:0;z-index:10;background:rgb(0 0 0 / 0.1)"
      document.body.append(layer)
    })
    await drag(page, await center(sidebarHandle(page)), { x: 40 })
    await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "25")
  })

  test("a press beside a handle doesn't click what's under it", async ({
    page,
  }) => {
    await page.evaluate(() => {
      const main = document.querySelector<HTMLElement>('[aria-label="Main"]')!
      main.style.position = "relative"
      const button = document.createElement("button")
      button.textContent = "Edge"
      button.style.cssText =
        "position:absolute;left:0;top:0;width:20px;height:200px;z-index:1"
      button.addEventListener("click", () => (button.dataset.clicked = ""))
      main.append(button)
    })
    const box = (await sidebarHandle(page).boundingBox())!
    await page.mouse.click(box.x + box.width + 3, box.y + 50)
    await expect(
      page.getByRole("button", { name: "Edge" })
    ).not.toHaveAttribute("data-clicked")
    await page
      .getByRole("button", { name: "Edge" })
      .click({ position: { x: 15, y: 50 } })
    await expect(page.getByRole("button", { name: "Edge" })).toHaveAttribute(
      "data-clicked"
    )
  })

  test("only the main button drags", async ({ page }) => {
    const point = await center(sidebarHandle(page))
    for (const button of ["right", "middle"] as const) {
      await page.mouse.move(point.x, point.y)
      await page.mouse.down({ button })
      await page.mouse.move(point.x + 40, point.y, { steps: 4 })
      await page.mouse.up({ button })
    }
    await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "25")
  })

  test("an iframe under the pointer doesn't stop a drag", async ({ page }) => {
    await page.evaluate(() => {
      const frame = document.createElement("iframe")
      frame.title = "Preview frame"
      frame.style.cssText = "width:100%;height:100%;border:0"
      frame.srcdoc = "<p>Frame</p>"
      document.querySelector('[aria-label="Code"]')!.append(frame)
    })
    await drag(page, await center(sidebarHandle(page)), { x: 100 })
    expect(await sizeOf(panel(page, "Sidebar"))).toBeCloseTo(
      editorSpace / 4 + 100,
      0
    )
  })

  test("at a limit, the cursor points the only way a handle can go", async ({
    page,
  }) => {
    await sidebarHandle(page).focus()
    await page.keyboard.press("End")
    const point = await center(sidebarHandle(page))
    await page.mouse.move(point.x, point.y)
    const cursor = () =>
      page.evaluate(() => getComputedStyle(document.body).cursor)
    await expect.poll(cursor).toBe("w-resize")
    await expect(sidebarHandle(page)).toHaveAttribute("data-hovering")
  })

  test("a saved layout is there on the first paint", async ({
    page,
    open,
    framework,
  }) => {
    test.skip(
      framework.endsWith("-ssr"),
      "A server can't read localStorage. The docs' cookie recipe covers it."
    )
    await open("resizable", { autosave: "spec" })
    await sidebarHandle(page).focus()
    await page.keyboard.press("Shift+ArrowRight")
    await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "35")
    // The first size the browser lays the panel out at, before any paint.
    await page.addInitScript(() => {
      new MutationObserver((_, observer) => {
        const sidebar = document.querySelector('[aria-label="Sidebar"]')
        if (!sidebar) {
          return
        }
        observer.disconnect()
        new ResizeObserver(([entry], resize) => {
          resize.disconnect()
          Object.assign(window, {
            firstWidth: entry.borderBoxSize[0].inlineSize,
          })
        }).observe(sidebar)
      }).observe(document, { childList: true, subtree: true })
    })
    await page.reload()
    await page.locator("body[data-mounted]").waitFor({ state: "attached" })
    await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "35")
    await page.waitForFunction(() => "firstWidth" in window)
    const first = await page.evaluate(
      () => (window as unknown as { firstWidth: number }).firstWidth
    )
    expect(first).toBeCloseTo(editorSpace * 0.35, 0)
  })
})
