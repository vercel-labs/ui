import type { Page } from "@playwright/test"
import { expect, shortcutKeys, test } from "../fixtures"
import { drawerFixture } from "../fixtures/drawer"
import {
  drawerDialog,
  drawerLog,
  drawerTrigger,
  handle,
  openDrawer,
  pointerDrag,
  sheetRect,
  touchDrag,
  waitForRest,
} from "./drawer.helpers"

// What the drawer does beyond the dialog pattern: iOS's sheet physics, the
// sheet and its content sharing one gesture, effects on the compositor, and
// a page that stays usable below a snap point.

test.describe("dialog", { tag: "@enhancement" }, () => {
  test("an open modal drawer is marked aria-modal", async ({ page, open }) => {
    await open("drawer")
    await openDrawer(page)
    await expect(drawerDialog(page)).toHaveAttribute("aria-modal", "true")
  })

  // The APG's dialog pattern puts focus on the first control, not the dialog itself.
  test("a keyboard open focuses its first control, and Tab cycles through the controls in order", async ({
    page,
    open,
    tab,
  }) => {
    await open("drawer")
    await drawerTrigger(page).focus()
    await page.keyboard.press("Enter")
    await expect(handle(page)).toBeFocused()
    await tab()
    await expect(page.getByRole("button", { name: "Submit" })).toBeFocused()
    await tab()
    await expect(page.getByRole("button", { name: "Cancel" })).toBeFocused()
    await tab()
    await expect(handle(page)).toBeFocused()
  })

  test("a controller's open() resolves with how it closed", async ({
    page,
    open,
  }) => {
    await open("drawer")
    const result = page.evaluate(() =>
      (
        window as unknown as {
          drawer: { open: () => Promise<{ reason: string }> }
        }
      ).drawer.open()
    )
    await expect(drawerDialog(page)).toBeVisible()
    // A press computed while the drawer still rises can land beside the button under load.
    await waitForRest(page)
    await page.getByRole("button", { name: "Cancel" }).click()
    expect((await result).reason).toBe("close-press")
  })
})

test.describe("shortcuts", { tag: "@enhancement" }, () => {
  const quickGoal = (page: Page) =>
    page.getByRole("button", {
      name: drawerFixture.shortcut.trigger,
      exact: true,
    })

  test("a trigger connected through a controller shows its shortcut in a Shortcut part, and binds it", async ({
    page,
    open,
  }) => {
    await open("drawer", { shortcut: "" })
    const { aria, text } = await shortcutKeys(page, "G")
    await expect(quickGoal(page)).toHaveAttribute("aria-keyshortcuts", aria)
    const hint = quickGoal(page).locator("[data-slot=drawer-shortcut]")
    await expect(hint).toHaveAttribute("aria-hidden", "true")
    await expect(hint).toHaveText(text)
    await page.keyboard.press("ControlOrMeta+g")
    await expect(drawerDialog(page)).toBeVisible()
  })
})

test.describe("state attributes", { tag: "@enhancement" }, () => {
  test("the content names its side, its snap point and whether it's at the largest", async ({
    page,
    open,
  }) => {
    await open("drawer", { snap: "0.25,0.5,1", scroll: "" })
    await openDrawer(page)
    await expect(drawerDialog(page)).toHaveAttribute("data-side", "bottom")
    await expect(drawerDialog(page)).toHaveAttribute("data-snap-point", "0.25")
    await expect(drawerDialog(page)).not.toHaveAttribute("data-expanded", "")
    await handle(page).focus()
    await page.keyboard.press("End")
    await expect(drawerDialog(page)).toHaveAttribute("data-snap-point", "1")
    await expect(drawerDialog(page)).toHaveAttribute("data-expanded", "")
  })

  test("a drawer resting at its own size reports the content snap point and is expanded", async ({
    page,
    open,
  }) => {
    await open("drawer")
    await openDrawer(page)
    await expect(drawerDialog(page)).toHaveAttribute(
      "data-snap-point",
      "content"
    )
    await expect(drawerDialog(page)).toHaveAttribute("data-expanded", "")
  })

  test("data-dragging is set while a drag moves it", async ({ page, open }) => {
    await open("drawer")
    await openDrawer(page)
    const box = (await page
      .getByRole("heading", { name: "Move goal" })
      .boundingBox())!
    await page.mouse.move(box.x + 10, box.y + 5)
    await page.mouse.down()
    await page.mouse.move(box.x + 10, box.y + 40, { steps: 5 })
    await expect(drawerDialog(page)).toHaveAttribute("data-dragging", "")
    await page.mouse.up()
    await expect(drawerDialog(page)).not.toHaveAttribute("data-dragging", "")
  })

  test("a drawer opened from inside another marks both, and the one beneath reads its depth from --drawer-stack", async ({
    page,
    open,
  }) => {
    await open("drawer", { nested: "" })
    await openDrawer(page)
    await page.getByRole("button", { name: "More options" }).click()
    await waitForRest(page, "More options")
    await expect(drawerDialog(page, "More options")).toHaveAttribute(
      "data-nested",
      ""
    )
    await expect(drawerDialog(page)).toHaveAttribute("data-nested-open", "")
    expect(
      await drawerDialog(page).evaluate((el) =>
        getComputedStyle(el).getPropertyValue("--drawer-stack")
      )
    ).toBe("1")
    await page.keyboard.press("Escape")
    await expect(drawerDialog(page, "More options")).toBeHidden()
    await expect(drawerDialog(page)).not.toHaveAttribute("data-nested-open", "")
  })
})

test.describe("physics", { tag: "@enhancement" }, () => {
  test("past the largest snap point it stretches less than 24px and springs back", async ({
    page,
    open,
  }) => {
    // Half the screen, so the pull stays inside the window in every browser.
    await open("drawer", { snap: "0.5", scroll: "" })
    await openDrawer(page)
    const top = (await sheetRect(page)).top
    const box = (await page
      .getByRole("heading", { name: "Move goal" })
      .boundingBox())!
    await page.mouse.move(box.x + 10, box.y + 5)
    await page.mouse.down()
    await page.mouse.move(box.x + 10, box.y - 300, { steps: 20 })
    // The drawer moves on the next frame after a pointer move.
    const stretched = async () => top - (await sheetRect(page)).top
    await expect.poll(stretched).toBeGreaterThan(5)
    expect(await stretched()).toBeLessThan(24)
    await page.mouse.up()
    await waitForRest(page)
    expect((await sheetRect(page)).top).toBe(top)
  })
})

// The pointer driver's own hand-off; on a touch screen `"auto"` would pick scroll snap.
test.describe("touch", { tag: "@enhancement" }, () => {
  test.use({ hasTouch: true })
  test.beforeEach(({ browserName }) => {
    test.skip(
      browserName !== "chromium",
      "Real touch input goes through Chromium's DevTools protocol."
    )
  })

  test("pulling down on scrolled content scrolls it to the top, then moves the drawer in the same gesture", async ({
    page,
    open,
    context,
  }) => {
    await open("drawer", { snap: "1", scroll: "", driver: "pointer" })
    await openDrawer(page)
    const list = page.getByRole("list", { name: "Activity" })
    await list.evaluate((el) => (el.scrollTop = 200))
    const top = (await sheetRect(page)).top
    const box = (await list.boundingBox())!
    const cdp = await context.newCDPSession(page)
    const x = box.x + 50
    const y = box.y + 50
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x, y }],
    })
    for (let step = 1; step <= 30; step++) {
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x, y: y + step * 15 }],
      })
    }
    expect(await list.evaluate((el) => el.scrollTop)).toBe(0)
    expect((await sheetRect(page)).top - top).toBeGreaterThan(150)
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    })
  })

  test("pushing up on content below the largest snap point grows the drawer before the content scrolls", async ({
    page,
    open,
    context,
  }) => {
    await open("drawer", { snap: "0.5,1", scroll: "", driver: "pointer" })
    await openDrawer(page)
    const list = page.getByRole("list", { name: "Activity" })
    const box = (await list.boundingBox())!
    await touchDrag(page, context, {
      x: box.x + 50,
      y: box.y + 40,
      dy: -260,
      steps: 20,
    })
    expect(await list.evaluate((el) => el.scrollTop)).toBe(0)
    await waitForRest(page)
    await expect(drawerDialog(page)).toHaveAttribute("data-snap-point", "1")
  })
})

test.describe("compositor", { tag: "@enhancement" }, () => {
  // The running animations on an element, with the properties they animate and their easing.
  const animations = (page: Page, selector: string) =>
    page.evaluate(
      (selector) =>
        document
          .querySelector(selector)!
          .getAnimations()
          .filter((animation) => animation.playState === "running")
          .map((animation) => {
            const effect = animation.effect as KeyframeEffect
            const keyframe = effect.getKeyframes()[0]
            return {
              properties: Object.keys(keyframe).filter(
                (key) =>
                  !["offset", "easing", "composite", "computedOffset"].includes(
                    key
                  )
              ),
              easing: effect.getTiming().easing as string,
            }
          }),
      selector
    )

  test("a settle runs as a spring sampled into linear(), on translate and the backdrop's opacity", async ({
    page,
    open,
  }) => {
    await open("drawer", { snap: "0.25,1", scroll: "" })
    await openDrawer(page)
    await handle(page).click()
    const sheet = await animations(page, '[data-slot="drawer-content"]')
    expect(sheet).toContainEqual({
      properties: ["translate"],
      easing: expect.stringMatching(/^linear\(/),
    })
    await open("drawer", { snap: "0.25,1", scroll: "" })
    await drawerTrigger(page).click()
    const backdrop = await animations(page, '[data-slot="drawer-backdrop"]')
    expect(backdrop).toContainEqual({
      properties: ["opacity"],
      easing: expect.stringMatching(/^linear\(/),
    })
  })

  test("while a finger drives it, the drawer writes no attributes, only styles", async ({
    page,
    open,
  }) => {
    await open("drawer", { snap: "0.5,1", scroll: "" })
    await openDrawer(page)
    await page.evaluate(() => {
      const records: string[] = []
      new MutationObserver((list) => {
        for (const record of list) {
          if (record.attributeName !== "style") {
            records.push(record.attributeName!)
          }
        }
      }).observe(document.querySelector('[data-slot="drawer-content"]')!, {
        attributes: true,
        subtree: true,
      })
      ;(window as unknown as { __mutations: string[] }).__mutations = records
    })
    await pointerDrag(page, {
      from: "Move goal",
      dy: -60,
      steps: 30,
      interval: 16,
    })
    const mutations = await page.evaluate(
      () => (window as unknown as { __mutations: string[] }).__mutations
    )
    expect(mutations.filter((name) => name !== "data-dragging")).toEqual([])
  })

  test("its variables are registered and don't inherit, so moving it restyles only the drawer", async ({
    page,
    open,
  }) => {
    await open("drawer")
    await openDrawer(page)
    const [own, child] = await drawerDialog(page).evaluate((el) => [
      getComputedStyle(el).getPropertyValue("--drawer-progress"),
      getComputedStyle(
        el.querySelector('[data-slot="drawer-title"]')!
      ).getPropertyValue("--drawer-progress"),
    ])
    expect(own).toBe("1")
    expect(child).toBe("0")
  })

  test("with reduced motion it fades in and out instead of sliding", async ({
    page,
    open,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await open("drawer")
    await drawerTrigger(page).click()
    const opening = await animations(page, '[data-slot="drawer-content"]')
    expect(opening.map((animation) => animation.properties)).toContainEqual([
      "opacity",
    ])
    expect(opening.map((animation) => animation.properties)).not.toContainEqual(
      ["translate"]
    )
  })
})

test.describe("page", { tag: "@enhancement" }, () => {
  test("an outlet outside the drawer follows it, and goes back when it closes", async ({
    page,
    open,
  }) => {
    await open("drawer", { outlet: "" })
    const outlet = page.getByRole("region", { name: "Page" })
    await openDrawer(page)
    expect(await outlet.evaluate((el) => getComputedStyle(el).scale)).toBe(
      "0.9"
    )
    await page.keyboard.press("Escape")
    await expect(drawerDialog(page)).toBeHidden()
    expect(await outlet.evaluate((el) => getComputedStyle(el).scale)).toBe(
      "none"
    )
  })

  test("the theme color dims while it's open and comes back when it closes", async ({
    page,
    open,
  }) => {
    await open("drawer", { "theme-color": "" })
    const color = () =>
      page.evaluate(
        () =>
          document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')!
            .content
      )
    await openDrawer(page)
    expect(await color()).toBe("rgb(204 204 204)")
    await page.keyboard.press("Escape")
    await expect(drawerDialog(page)).toBeHidden()
    expect(await color()).toBe("#ffffff")
  })

  test("content that grows moves its content snap point, and the drawer follows", async ({
    page,
    open,
  }) => {
    await open("drawer", { grow: "" })
    await openDrawer(page)
    const before = await sheetRect(page)
    await page.getByRole("button", { name: "Show more" }).click()
    // The resize is observed at the next rendering update, and the settle starts there,
    // so waiting for rest any earlier can catch the drawer before it moves.
    await page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve))
        )
    )
    await waitForRest(page)
    const after = await sheetRect(page)
    expect(after.top).toBeLessThan(before.top)
    expect(after.bottom).toBe(page.viewportSize()!.height)
  })

  test("Escape on a drawer that can't be dismissed nudges it toward closing", async ({
    page,
    open,
  }) => {
    await open("drawer", { dismissible: "false" })
    await openDrawer(page)
    await page.keyboard.press("Escape")
    expect(
      await drawerDialog(page).evaluate((el) => el.getAnimations().length)
    ).toBeGreaterThan(0)
    await waitForRest(page)
    await expect(drawerDialog(page)).toBeVisible()
  })
})

test(
  "without a touch screen `auto` picks the pointer driver",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("drawer")
    await openDrawer(page)
    await expect(drawerDialog(page)).toHaveAttribute("data-driver", "pointer")
  }
)

test.describe("scroll-snap driver", { tag: "@enhancement" }, () => {
  test.use({ hasTouch: true })
  test.beforeEach(async ({ browserName, open, page }) => {
    test.skip(
      browserName !== "chromium",
      "Scroll gestures go through Chromium's DevTools protocol."
    )
    await open("drawer", {
      driver: "scroll-snap",
      snap: "0.25,0.5,1",
      scroll: "",
    })
    await openDrawer(page)
  })

  test("on a touch screen it's the driver `auto` picks", async ({
    page,
    open,
  }) => {
    await open("drawer", { snap: "0.25,0.5,1" })
    await openDrawer(page)
    await expect(drawerDialog(page)).toHaveAttribute(
      "data-driver",
      "scroll-snap"
    )
  })

  for (const [option, value] of [
    ["modal-above", "0.25"],
    ["expand-on-scroll", "false"],
  ]) {
    test(`on a touch screen \`auto\` keeps the pointer driver with ${option}=${value}`, async ({
      page,
      open,
    }) => {
      await open("drawer", { snap: "0.25,0.5,1", [option]: value })
      await openDrawer(page)
      await expect(drawerDialog(page)).toHaveAttribute("data-driver", "pointer")
    })
  }

  test("it opens at its first snap point with the browser's scrolling", async ({
    page,
  }) => {
    await expect(drawerDialog(page)).toHaveAttribute(
      "data-driver",
      "scroll-snap"
    )
    expect((await sheetRect(page)).top).toBe(
      Math.round(page.viewportSize()!.height * 0.75)
    )
  })

  test("a swipe up snaps to the next snap point and reports the swipe", async ({
    page,
    context,
  }) => {
    // Dispatched touches, not `Input.synthesizeScrollGesture`: on Linux a synthesized touch
    // gesture goes through the platform's own input path, where it never scrolled the sheet.
    // It's let go short of 0.5 with no fling, so landing on 0.5 is the snapping's doing.
    const height = page.viewportSize()!.height
    await touchDrag(page, context, {
      x: 200,
      y: height - 60,
      dy: -height * 0.2,
      steps: 12,
      hold: 200,
    })
    await expect.poll(() => drawerLog(page)).toContain("0.5:swipe")
    await waitForRest(page)
    expect((await sheetRect(page)).top).toBe(Math.round(height * 0.5))
  })

  test("it comes to rest when the scroll ends before the page hears the finger lift", async ({
    page,
  }) => {
    // A passive touchend can reach the page after scrollend. This plays that order: the
    // scroll ends while the page still thinks a finger is down.
    const height = page.viewportSize()!.height
    await drawerDialog(page).evaluate(async (sheet, extent) => {
      const host = sheet.parentElement!
      const ended = new Promise((resolve) =>
        host.addEventListener("scrollend", resolve, { once: true })
      )
      host.dispatchEvent(new Event("touchstart"))
      host.scrollTop += extent
      await ended
      host.dispatchEvent(new Event("touchend"))
    }, height * 0.25)
    await expect.poll(() => drawerLog(page)).toContain("0.5:swipe")
  })

  test("the handle moves it with a spring, like the pointer driver", async ({
    page,
  }) => {
    await handle(page).click()
    await expect(drawerDialog(page)).toHaveAttribute("data-snap-point", "0.5")
    await waitForRest(page)
    expect((await sheetRect(page)).top).toBe(
      Math.round(page.viewportSize()!.height * 0.5)
    )
  })
})
