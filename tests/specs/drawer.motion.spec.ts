import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"
import { drawerDialog, drawerLog, drawerTrigger, openDrawer, sheetRect, waitForRest } from "./drawer.helpers"

// How the drawer moves frame by frame: when an open starts, catching it while it
// moves, and riding the on-screen keyboard.

/** The drawer's top on every frame while `run` runs. */
async function recordTops(page: Page, run: () => Promise<unknown>) {
  await page.evaluate(() => {
    const tops: number[] = []
    const w = window as unknown as { __tops: number[]; __recording: boolean }
    w.__tops = tops
    w.__recording = true
    const tick = () => {
      // Web components keep a closed drawer's content in the page, without a box.
      const box = document.querySelector('[data-slot="drawer-content"]')?.getBoundingClientRect()
      if (box?.height) tops.push(Math.round(box.top))
      if (w.__recording) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })
  await run()
  return page.evaluate(() => {
    const w = window as unknown as { __tops: number[]; __recording: boolean }
    w.__recording = false
    return w.__tops
  })
}

test.describe("opening", { tag: "@enhancement" }, () => {
  for (const driver of ["pointer", "scroll-snap"]) {
    test(`with the ${driver} driver it rises from closed on its first frame, never showing at rest first`, async ({
      page,
      open,
    }) => {
      await open("drawer", { snap: "0.5,1", scroll: "", driver })
      const tops = await recordTops(page, async () => {
        await drawerTrigger(page).click()
        await waitForRest(page)
      })
      const rest = tops.at(-1)!
      // Every frame is at or below the one before, from below the screen down to rest.
      expect(tops[0]).toBeGreaterThan(page.viewportSize()!.height)
      expect(tops.every((top, index) => index === 0 || top <= tops[index - 1])).toBe(true)
      expect(rest).toBe(Math.round(page.viewportSize()!.height * 0.5))
    })
  }
})

test(
  "the backdrop and the drawer start their open on the same frame",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("drawer", { snap: "0.5,1", driver: "pointer" })
    await drawerTrigger(page).click()
    const startTimes = await page.evaluate(async () => {
      const running = (selector: string) =>
        document
          .querySelector(selector)!
          .getAnimations()
          .filter((animation) => animation.playState === "running")
      // The open is held a second ahead until the drawer's first frame moves it there.
      // Before that every start time is the same anyway, so compare only once it moved.
      await waitFor(() =>
        running('[data-slot="drawer-content"]').some(
          (animation) => Number(animation.startTime) <= Number(document.timeline.currentTime),
        ),
      )
      const animations = [
        ...running('[data-slot="drawer-content"]'),
        ...running('[data-slot="drawer-backdrop"]'),
      ]
      await Promise.all(animations.map((animation) => animation.ready))
      return animations.map((animation) => Number(animation.startTime))

      function waitFor(condition: () => boolean) {
        return new Promise<void>((resolve) => {
          const check = () => (condition() ? resolve() : requestAnimationFrame(check))
          check()
        })
      }
    })
    expect(startTimes.length).toBeGreaterThan(1)
    expect(new Set(startTimes).size).toBe(1)
  },
)

test.describe("catching it", { tag: "@enhancement" }, () => {
  test.use({ hasTouch: true })
  test.beforeEach(({ browserName }) => {
    test.skip(browserName !== "chromium", "Real touch input goes through Chromium's DevTools protocol.")
  })

  test("a touch while a scroll-snap drawer rises holds it where it is, and letting go settles it", async ({
    page,
    open,
    context,
  }) => {
    await open("drawer", { snap: "0.5,1", scroll: "", driver: "scroll-snap" })
    const height = page.viewportSize()!.height
    const cdp = await context.newCDPSession(page)
    await drawerTrigger(page).click()
    const caught = await drawerDialog(page).evaluate(
      (el, limit) =>
        new Promise<number>((resolve) => {
          const check = () => {
            const top = el.getBoundingClientRect().top
            if (top < limit) resolve(top)
            else requestAnimationFrame(check)
          }
          check()
        }),
      height,
    )
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: 200, y: caught + 20 }],
    })
    const held = (await sheetRect(page)).top
    expect(held).toBeGreaterThan(Math.round(height * 0.5) + 5)
    await page.waitForTimeout(300)
    expect((await sheetRect(page)).top).toBe(held)
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] })
    await waitForRest(page)
    expect((await sheetRect(page)).top).toBe(Math.round(height * 0.5))
  })

  test("a swipe down on a scroll-snap drawer at its first snap point closes it", async ({
    page,
    open,
    context,
  }) => {
    await open("drawer", { driver: "scroll-snap" })
    await openDrawer(page)
    const rect = await sheetRect(page)
    const cdp = await context.newCDPSession(page)
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: 200, y: rect.top + 20 }],
    })
    for (let step = 1; step <= 16; step++)
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: 200, y: rect.top + 20 + (rect.height * step) / 16 }],
      })
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] })
    await expect(drawerDialog(page)).toBeHidden()
    expect(await drawerLog(page)).toContain("drawer:false:swipe")
  })

  test("without preventEdgeSwipe nothing on the page can cancel a touch, so scrolling never waits for script", async ({
    page,
    open,
    context,
  }) => {
    await open("drawer", { driver: "scroll-snap" })
    await openDrawer(page)
    const cdp = await context.newCDPSession(page)
    const { result } = await cdp.send("Runtime.evaluate", { expression: "document" })
    const { listeners } = await cdp.send("DOMDebugger.getEventListeners", { objectId: result.objectId! })
    expect(listeners.filter((listener) => listener.type.startsWith("touch") && !listener.passive)).toEqual([])
  })
})

test.describe("keyboard", { tag: "@enhancement" }, () => {
  // An on-screen keyboard as the page sees it: the visual viewport shrinks, and
  // Safari can pan it down the page.
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const real = window.visualViewport!
      const fake = new EventTarget() as EventTarget & { height: number }
      let height: number | null = null
      let offsetTop = 0
      for (const key of ["width", "offsetLeft", "pageLeft", "pageTop", "scale"])
        Object.defineProperty(fake, key, { get: () => real[key as keyof VisualViewport] })
      Object.defineProperty(fake, "height", { get: () => height ?? real.height })
      Object.defineProperty(fake, "offsetTop", { get: () => offsetTop })
      Object.defineProperty(window, "visualViewport", { get: () => fake })
      const w = window as unknown as {
        __keyboard: (value: number | null) => void
        __pan: (value: number) => void
      }
      w.__keyboard = (value) => {
        height = value
        fake.dispatchEvent(new Event("resize"))
      }
      w.__pan = (value) => {
        offsetTop = value
        fake.dispatchEvent(new Event("scroll"))
      }
    })
  })

  const showKeyboard = (page: Page, covered: number | null) =>
    page.evaluate(
      (value) =>
        (window as unknown as { __keyboard: (value: number | null) => void }).__keyboard(
          value === null ? null : window.innerHeight - value,
        ),
      covered,
    )

  for (const driver of ["pointer", "scroll-snap"]) {
    test(`with the ${driver} driver it slides up with the keyboard instead of jumping, and back down`, async ({
      page,
      open,
    }) => {
      await open("drawer", { field: "", driver })
      await openDrawer(page)
      const before = (await sheetRect(page)).top
      const tops = await recordTops(page, async () => {
        await showKeyboard(page, 300)
        await page.waitForTimeout(400)
      })
      expect(
        tops.some((top) => top < before - 30 && top > before - 270),
        "it passes in between on the way",
      ).toBe(true)
      expect(tops.at(-1), "it ends above the keyboard").toBe(before - 300)
      await showKeyboard(page, null)
      await expect.poll(async () => (await sheetRect(page)).top).toBe(before)
    })
  }

  test("a pan of the visual viewport under the open keyboard moves it at once, without a slide", async ({
    page,
    open,
  }) => {
    await open("drawer", { field: "", driver: "pointer" })
    await openDrawer(page)
    await showKeyboard(page, 300)
    // The keyboard's slide has finished.
    await expect
      .poll(() => drawerDialog(page).evaluate((el) => el.parentElement!.getAnimations().length))
      .toBe(0)
    const before = (await sheetRect(page)).top
    const tops = await recordTops(page, async () => {
      await page.evaluate(() => (window as unknown as { __pan: (value: number) => void }).__pan(100))
      await page.waitForTimeout(300)
    })
    // The keyboard covers 100px less of the layout viewport: one step down, nothing in between.
    expect(tops.at(-1)).toBe(before + 100)
    expect(tops.filter((top) => top !== before && top !== before + 100)).toEqual([])
  })

  test("a drawer taller than the room above the keyboard never jumps past where it ends up", async ({
    page,
    open,
  }) => {
    await open("drawer", { field: "", scroll: "", snap: "1", driver: "pointer" })
    await openDrawer(page)
    const tops = await recordTops(page, async () => {
      await showKeyboard(page, 300)
      await page.waitForTimeout(500)
    })
    const end = tops.at(-1)!
    expect(Math.min(...tops)).toBeGreaterThanOrEqual(end)
    expect(end).toBeGreaterThanOrEqual(0)
  })
})
