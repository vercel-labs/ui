import { expect, test } from "../fixtures"
import {
  actionOutput,
  drawerDialog,
  drawerLog,
  drawerTrigger,
  focusIsInside,
  handle,
  openDrawer,
  outside,
  pointerDrag,
  sheetRect,
  touchDrag,
  waitForRest,
} from "./drawer.helpers"

// A drawer is a modal dialog (https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
// presented as a sheet against an edge of the screen, which rests on snap
// points and follows a drag.

test.describe("dialog", () => {
  test.beforeEach(async ({ open }) => {
    await open("drawer")
  })

  test("the trigger advertises a dialog", async ({ page }) => {
    await expect(drawerTrigger(page)).toHaveAttribute("aria-haspopup", "dialog")
  })

  test("the trigger opens a modal dialog named by its title and described by its description", async ({
    page,
  }) => {
    await drawerTrigger(page).click()
    await expect(drawerDialog(page)).toBeVisible()
    await expect(drawerDialog(page)).toHaveAccessibleDescription(
      "Set your daily activity goal."
    )
    expect(await drawerLog(page)).toEqual(["drawer:true:trigger-press"])
  })

  test("opening moves focus into the drawer and closing returns it to the trigger", async ({
    page,
  }) => {
    await drawerTrigger(page).focus()
    await page.keyboard.press("Enter")
    await expect.poll(() => focusIsInside(page)).toBe(true)
    await page.keyboard.press("Escape")
    await expect(drawerDialog(page)).toBeHidden()
    await expect(drawerTrigger(page)).toBeFocused()
  })

  test("Tab stays inside the drawer", async ({ page, tab }) => {
    await drawerTrigger(page).focus()
    await page.keyboard.press("Enter")
    await expect.poll(() => focusIsInside(page)).toBe(true)
    // The drawer has four stops at most, so five Tabs wrap around at least once.
    for (let step = 0; step < 5; step++) {
      await tab()
      await expect.poll(() => focusIsInside(page)).toBe(true)
    }
  })

  test("Escape closes it with the escape-key reason", async ({ page }) => {
    await openDrawer(page)
    await page.keyboard.press("Escape")
    await expect(drawerDialog(page)).toBeHidden()
    expect(await drawerLog(page)).toContain("drawer:false:escape-key")
  })

  test("pressing the backdrop closes it", async ({ page }) => {
    await openDrawer(page)
    await page.mouse.click(200, 40)
    await expect(drawerDialog(page)).toBeHidden()
    expect(await drawerLog(page)).toContain("drawer:false:outside-press")
  })

  test("a Close part closes it", async ({ page }) => {
    await openDrawer(page)
    await page.getByRole("button", { name: "Cancel" }).click()
    await expect(drawerDialog(page)).toBeHidden()
    expect(await drawerLog(page)).toContain("drawer:false:close-press")
  })

  test("buttons inside it work without closing it", async ({ page }) => {
    await openDrawer(page)
    await page.getByRole("button", { name: "Submit" }).click()
    await expect(actionOutput(page)).toHaveText("submit")
    await expect(drawerDialog(page)).toBeVisible()
  })

  test("the page behind is hidden from assistive technology while it's open", async ({
    page,
  }) => {
    // Hidden either way: inert, or aria-hidden.
    const hidden = () =>
      outside(page, "After").evaluate(
        (el) => !!el.closest('[inert], [aria-hidden="true"]')
      )
    await openDrawer(page)
    expect(await hidden()).toBe(true)
    await page.keyboard.press("Escape")
    await expect(drawerDialog(page)).toBeHidden()
    expect(await hidden()).toBe(false)
  })

  test("opening and closing never scroll or restyle the page", async ({
    page,
  }) => {
    // Inline styles as text: a lock that put everything back may leave an empty style attribute.
    const before = await page.evaluate(() => [
      document.documentElement.style.cssText,
      document.body.style.cssText,
      scrollY,
    ])
    await openDrawer(page)
    await page.keyboard.press("Escape")
    await expect(drawerDialog(page)).toBeHidden()
    expect(
      await page.evaluate(() => [
        document.documentElement.style.cssText,
        document.body.style.cssText,
        scrollY,
      ])
    ).toEqual(before)
  })

  test("a controller opens it from outside", async ({ page }) => {
    await outside(page, "Open with controller").click()
    await expect(drawerDialog(page)).toBeVisible()
  })
})

test.describe("sheet", () => {
  test("it rises from the bottom and rests against it at its own size", async ({
    page,
    open,
  }) => {
    await open("drawer")
    await openDrawer(page)
    const viewport = page.viewportSize()!
    const rect = await sheetRect(page)
    expect(rect.bottom).toBe(viewport.height)
    expect(rect.top).toBeGreaterThan(0)
  })

  test("it opens at the first snap point, a fraction of the screen", async ({
    page,
    open,
  }) => {
    await open("drawer", { snap: "0.25,0.5,1", scroll: "" })
    await openDrawer(page)
    const viewport = page.viewportSize()!
    expect((await sheetRect(page)).top).toBe(Math.round(viewport.height * 0.75))
  })

  test("a slow drag settles on the nearest snap point and reports the swipe", async ({
    page,
    open,
  }) => {
    await open("drawer", { snap: "0.25,0.5,1", scroll: "" })
    await openDrawer(page)
    const viewport = page.viewportSize()!
    await pointerDrag(page, {
      from: "Move goal",
      dy: -viewport.height * 0.22,
      steps: 20,
      interval: 30,
    })
    await waitForRest(page)
    expect((await sheetRect(page)).top).toBe(Math.round(viewport.height * 0.5))
    expect(await drawerLog(page)).toContain("0.5:swipe")
  })

  test("a drag down past the smallest snap point closes it with the swipe reason", async ({
    page,
    open,
  }) => {
    await open("drawer")
    await openDrawer(page)
    const { height } = await sheetRect(page)
    await pointerDrag(page, {
      from: "Move goal",
      dy: height * 0.8,
      steps: 20,
      interval: 30,
    })
    await expect(drawerDialog(page)).toBeHidden()
    expect(await drawerLog(page)).toContain("drawer:false:swipe")
    await expect(drawerTrigger(page)).toBeFocused()
  })

  test("a short fast flick down closes it, though it moved less than half its height", async ({
    page,
    open,
  }) => {
    await open("drawer", { snap: "0.5,1", scroll: "" })
    await openDrawer(page)
    await pointerDrag(page, {
      from: "Move goal",
      dy: 80,
      steps: 6,
      interval: 8,
    })
    await expect(drawerDialog(page)).toBeHidden()
    expect(await drawerLog(page)).toContain("drawer:false:swipe")
  })

  test("the same distance, slowly, settles back", async ({ page, open }) => {
    await open("drawer", { snap: "0.5,1", scroll: "" })
    await openDrawer(page)
    const top = (await sheetRect(page)).top
    await pointerDrag(page, {
      from: "Move goal",
      dy: 80,
      steps: 20,
      interval: 40,
    })
    await waitForRest(page)
    expect((await sheetRect(page)).top).toBe(top)
  })

  test("a fling up from the smallest snap point can pass the middle one", async ({
    page,
    open,
  }) => {
    await open("drawer", { snap: "0.25,0.5,1", scroll: "" })
    await openDrawer(page)
    await pointerDrag(page, {
      from: "Move goal",
      dy: -200,
      steps: 5,
      interval: 8,
    })
    await waitForRest(page)
    expect((await sheetRect(page)).top).toBeLessThan(
      page.viewportSize()!.height * 0.25
    )
  })

  test("a press while it rises catches it and holds it under the finger", async ({
    page,
    open,
  }) => {
    await open("drawer", { snap: "0.5,1", scroll: "" })
    await drawerTrigger(page).click()
    const drift = await page.evaluate(async () => {
      const wait = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms))
      await wait(120)
      const sheet = document.querySelector<HTMLElement>('[role="dialog"]')!
      const title = sheet.querySelector<HTMLElement>("h2, [role=heading]")!
      const { left, top } = title.getBoundingClientRect()
      const init = {
        bubbles: true,
        pointerId: 9,
        pointerType: "mouse",
        isPrimary: true,
        button: 0,
      }
      title.dispatchEvent(
        new PointerEvent("pointerdown", {
          ...init,
          buttons: 1,
          clientX: left + 5,
          clientY: top + 5,
        })
      )
      await new Promise((resolve) => requestAnimationFrame(resolve))
      const caught = sheet.getBoundingClientRect().top
      await wait(200)
      const held = sheet.getBoundingClientRect().top
      title.dispatchEvent(
        new PointerEvent("pointerup", {
          ...init,
          buttons: 0,
          clientX: left + 5,
          clientY: top + 5,
        })
      )
      return Math.abs(held - caught)
    })
    // A finger that doesn't move holds the drawer still, mid-flight, like a native sheet.
    expect(drift).toBeLessThan(2)
  })
  test("a short drag back up keeps it open", async ({ page, open }) => {
    await open("drawer")
    await openDrawer(page)
    await pointerDrag(page, {
      from: "Move goal",
      dy: 20,
      steps: 10,
      interval: 30,
    })
    await waitForRest(page)
    await expect(drawerDialog(page)).toBeVisible()
    expect((await sheetRect(page)).bottom).toBe(page.viewportSize()!.height)
  })

  test("a click on a button inside it isn't a drag", async ({ page, open }) => {
    await open("drawer")
    await openDrawer(page)
    const top = (await sheetRect(page)).top
    await page.getByRole("button", { name: "Submit" }).click()
    await expect(actionOutput(page)).toHaveText("submit")
    expect((await sheetRect(page)).top).toBe(top)
  })

  for (const side of ["top", "left", "right"] as const) {
    test(`with side="${side}" it rests against the ${side} edge`, async ({
      page,
      open,
    }) => {
      await open("drawer", { side })
      await openDrawer(page)
      const viewport = page.viewportSize()!
      const rect = await sheetRect(page)
      if (side === "top") {
        expect(rect.top).toBe(0)
      }
      if (side === "left") {
        expect(rect.left).toBe(0)
      }
      if (side === "right") {
        expect(rect.right).toBe(viewport.width)
      }
    })
  }

  test('with side="left" a drag toward the left closes it', async ({
    page,
    open,
  }) => {
    await open("drawer", { side: "left" })
    await openDrawer(page)
    await pointerDrag(page, {
      from: "Move goal",
      dy: 0,
      dx: -240,
      steps: 20,
      interval: 30,
    })
    await expect(drawerDialog(page)).toBeHidden()
    expect(await drawerLog(page)).toContain("drawer:false:swipe")
  })
})

test.describe("touch", () => {
  test.use({ hasTouch: true })
  test.beforeEach(({ browserName }) => {
    test.skip(
      browserName !== "chromium",
      "Real touch input goes through Chromium's DevTools protocol."
    )
  })

  test("a touch drag down closes it", async ({ page, open, context }) => {
    await open("drawer")
    await openDrawer(page)
    const rect = await sheetRect(page)
    await touchDrag(page, context, {
      x: 200,
      y: rect.top + 20,
      dy: rect.height,
      steps: 16,
    })
    await expect(drawerDialog(page)).toBeHidden()
    expect(await drawerLog(page)).toContain("drawer:false:swipe")
  })
})

// The handle, refusing a dismissal and modality per snap point go past the
// pattern, so these three groups are enhancements.
test.describe("handle", { tag: "@enhancement" }, () => {
  test.beforeEach(async ({ open, page }) => {
    await open("drawer", { snap: "0.25,0.5,1", scroll: "" })
    await openDrawer(page)
  })

  test("pressing it moves to the next snap point and wraps", async ({
    page,
  }) => {
    await handle(page).click()
    await expect(drawerDialog(page)).toHaveAttribute("data-snap-point", "0.5")
    await handle(page).click()
    await expect(drawerDialog(page)).toHaveAttribute("data-snap-point", "1")
    await handle(page).click()
    await expect(drawerDialog(page)).toHaveAttribute("data-snap-point", "0.25")
    expect(await drawerLog(page)).toEqual([
      "drawer:true:trigger-press",
      "0.5:handle-press",
      "1:handle-press",
      "0.25:handle-press",
    ])
  })

  test("arrow keys step without wrapping, and Home and End go to the ends", async ({
    page,
  }) => {
    await handle(page).focus()
    await page.keyboard.press("ArrowUp")
    await expect(drawerDialog(page)).toHaveAttribute("data-snap-point", "0.5")
    await page.keyboard.press("End")
    await expect(drawerDialog(page)).toHaveAttribute("data-snap-point", "1")
    await page.keyboard.press("ArrowUp")
    await expect(drawerDialog(page)).toHaveAttribute("data-snap-point", "1")
    await page.keyboard.press("Home")
    await expect(drawerDialog(page)).toHaveAttribute("data-snap-point", "0.25")
    await page.keyboard.press("ArrowDown")
    await expect(drawerDialog(page)).toHaveAttribute("data-snap-point", "0.25")
    expect(await drawerLog(page)).toEqual([
      "drawer:true:trigger-press",
      "0.5:handle-key",
      "1:handle-key",
      "0.25:handle-key",
    ])
  })

  test("moving it moves the drawer to the snap point's extent", async ({
    page,
  }) => {
    await handle(page).focus()
    await page.keyboard.press("End")
    await waitForRest(page)
    const rect = await sheetRect(page)
    expect(rect.bottom).toBe(page.viewportSize()!.height)
    expect(rect.height).toBeGreaterThan(page.viewportSize()!.height * 0.75)
  })

  test("a snap point a controller sets while it animates closed is where it opens next", async ({
    page,
  }) => {
    await page.keyboard.press("Escape")
    await expect(drawerDialog(page)).toHaveAttribute("data-ending-style")
    await page.evaluate(() =>
      (
        window as unknown as {
          drawer: { setSnapPoint: (point: number) => void }
        }
      ).drawer.setSnapPoint(1)
    )
    await expect(page.getByRole("dialog")).toHaveCount(0)
    // open() resolves when it closes, so it isn't awaited.
    await page.evaluate(
      () =>
        void (
          window as unknown as { drawer: { open: () => unknown } }
        ).drawer.open()
    )
    await expect(drawerDialog(page)).toHaveAttribute("data-snap-point", "1")
  })

  test("a controller moves it with the imperative reason", async ({ page }) => {
    await page.evaluate(() =>
      (
        window as unknown as {
          drawer: { setSnapPoint: (point: number) => void }
        }
      ).drawer.setSnapPoint(0.5)
    )
    await expect(drawerDialog(page)).toHaveAttribute("data-snap-point", "0.5")
    expect(await drawerLog(page)).toContain("0.5:imperative")
  })
})

test.describe("not dismissible", { tag: "@enhancement" }, () => {
  test.beforeEach(async ({ open, page }) => {
    await open("drawer", { dismissible: "false" })
    await openDrawer(page)
  })

  test("Escape reports an attempt and keeps it open", async ({ page }) => {
    await page.keyboard.press("Escape")
    await waitForRest(page)
    await expect(drawerDialog(page)).toBeVisible()
    expect(await drawerLog(page)).toContain("attempt:escape-key")
  })

  test("a press on the backdrop reports an attempt and keeps it open", async ({
    page,
  }) => {
    await page.mouse.click(200, 40)
    await expect(drawerDialog(page)).toBeVisible()
    expect(await drawerLog(page)).toContain("attempt:outside-press")
  })

  test("a swipe down resists, springs back and reports an attempt", async ({
    page,
  }) => {
    const bottom = (await sheetRect(page)).bottom
    await pointerDrag(page, {
      from: "Move goal",
      dy: 300,
      steps: 20,
      interval: 30,
    })
    await waitForRest(page)
    await expect(drawerDialog(page)).toBeVisible()
    expect((await sheetRect(page)).bottom).toBe(bottom)
    expect(await drawerLog(page)).toContain("attempt:swipe")
  })
})

test.describe("modal above a snap point", { tag: "@enhancement" }, () => {
  test.beforeEach(async ({ open, page }) => {
    await open("drawer", {
      snap: "0.25,0.75",
      "modal-above": "0.25",
      scroll: "",
    })
    await openDrawer(page)
  })

  test("at that snap point the page stays usable and the drawer isn't modal", async ({
    page,
  }) => {
    await expect(drawerDialog(page)).not.toHaveAttribute("aria-modal", "true")
    await expect(drawerDialog(page)).toHaveAttribute("data-interactive", "")
    await page.getByRole("button", { name: "Page action" }).click()
    await expect(actionOutput(page)).toHaveText("page")
    await expect(drawerDialog(page)).toBeVisible()
  })

  test("above it the drawer becomes modal, and back down the page is usable again", async ({
    page,
  }) => {
    await handle(page).click()
    await waitForRest(page)
    await expect(drawerDialog(page)).toHaveAttribute("aria-modal", "true")
    expect(
      await outside(page, "Page action").evaluate(
        (el) => !!el.closest("[inert]")
      )
    ).toBe(true)
    await handle(page).click()
    await waitForRest(page)
    await expect(drawerDialog(page)).not.toHaveAttribute("aria-modal", "true")
    expect(
      await outside(page, "Page action").evaluate(
        (el) => !!el.closest("[inert]")
      )
    ).toBe(false)
  })

  test("the switch doesn't move focus", async ({ page }) => {
    await handle(page).focus()
    await page.keyboard.press("ArrowUp")
    await waitForRest(page)
    await expect(handle(page)).toBeFocused()
  })
})

test.describe("nested", () => {
  test.beforeEach(async ({ open, page }) => {
    await open("drawer", { nested: "" })
    await openDrawer(page)
    await page.getByRole("button", { name: "More options" }).click()
    await expect(drawerDialog(page, "More options")).toBeVisible()
    await waitForRest(page, "More options")
  })

  test("Escape closes only the drawer on top", async ({ page }) => {
    await page.keyboard.press("Escape")
    await expect(drawerDialog(page, "More options")).toBeHidden()
    await expect(drawerDialog(page)).toBeVisible()
  })
})
