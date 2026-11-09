import type { BrowserContext, Page } from "@playwright/test"
import { expect } from "../fixtures"

// The drawer is a dialog named by its title. Outside elements are found by
// text while a modal drawer hides the page from assistive technology.
const drawerDialog = (page: Page, name = "Move goal") =>
  page.getByRole("dialog", { name })
const drawerTrigger = (page: Page) =>
  page.getByRole("button", { name: "Move goal" })
const handle = (page: Page) => page.getByRole("button", { name: "Resize" })
const outside = (page: Page, text: string) =>
  page.locator("button", { hasText: new RegExp(`^${text}$`) })

/** The page's last action. A modal drawer may hide it from assistive technology, so it's found either way. */
const actionOutput = (page: Page) =>
  page.getByRole("status", { name: "Last action", includeHidden: true })

/** Whether focus is inside the drawer named `name`. */
const focusIsInside = (page: Page, name = "Move goal") =>
  drawerDialog(page, name).evaluate((el) => el.contains(document.activeElement))

/** What the fixture recorded: open changes, snap point changes and refused dismissals. */
const drawerLog = (page: Page) =>
  page.evaluate(
    () => (window as unknown as { __drawerLog: string[] }).__drawerLog
  )

/** The drawer's content box, rounded. */
function sheetRect(page: Page, name = "Move goal") {
  return drawerDialog(page, name).evaluate((el) => {
    const { top, left, bottom, right, width, height } =
      el.getBoundingClientRect()
    return {
      top: Math.round(top),
      left: Math.round(left),
      bottom: Math.round(bottom),
      right: Math.round(right),
      width,
      height,
    }
  })
}

/** Waits until nothing on the drawer animates and no finger drives it. */
async function waitForRest(page: Page, name = "Move goal") {
  await expect
    .poll(() =>
      drawerDialog(page, name).evaluate(
        (el) =>
          !el.hasAttribute("data-dragging") &&
          // Effects tied to a scroll timeline follow the scroller and never finish.
          el
            .getAnimations()
            .every(
              (animation) =>
                animation.playState !== "running" ||
                animation.timeline !== document.timeline
            )
      )
    )
    .toBe(true)
}

/** Opens the drawer with its trigger and waits for it to come to rest. */
async function openDrawer(page: Page) {
  await drawerTrigger(page).click()
  await expect(drawerDialog(page)).toBeVisible()
  await waitForRest(page)
}

/**
 * Drags with pointer events dispatched in the page, every `interval` ms, so a
 * release velocity is exact whatever the browser and the machine's load.
 * Starts at the center of the element named `from` and moves `dy` px.
 */
async function pointerDrag(
  page: Page,
  options: {
    from: string
    dy: number
    dx?: number
    steps?: number
    interval?: number
    pointerType?: string
  }
) {
  await page.evaluate(
    async ({
      from,
      dy,
      dx = 0,
      steps = 10,
      interval = 16,
      pointerType = "mouse",
    }) => {
      const target = [
        ...document.querySelectorAll<HTMLElement>(
          "h2, [role=heading], [data-slot$=-title]"
        ),
      ].find((el) => el.textContent?.trim() === from)!
      const box = target.getBoundingClientRect()
      const x = box.left + Math.min(20, box.width / 2)
      const y = box.top + box.height / 2
      const fire = (
        type: string,
        at: { x: number; y: number },
        buttons: number
      ) =>
        target.dispatchEvent(
          new PointerEvent(type, {
            bubbles: true,
            cancelable: true,
            composed: true,
            pointerId: 7,
            pointerType,
            isPrimary: true,
            button: 0,
            buttons,
            clientX: at.x,
            clientY: at.y,
          })
        )
      fire("pointerdown", { x, y }, 1)
      for (let step = 1; step <= steps; step++) {
        await new Promise((resolve) => setTimeout(resolve, interval))
        fire(
          "pointermove",
          { x: x + (dx * step) / steps, y: y + (dy * step) / steps },
          1
        )
      }
      fire("pointerup", { x: x + dx, y: y + dy }, 0)
    },
    options
  )
}

/**
 * A real touch drag through Chromium's input pipeline, so native scrolling takes
 * part. With `hold`, the finger rests that many ms at the end before lifting, so
 * the release has no velocity and the browser starts no fling.
 */
async function touchDrag(
  page: Page,
  context: BrowserContext,
  options: { x: number; y: number; dy: number; steps?: number; hold?: number }
) {
  const cdp = await context.newCDPSession(page)
  const { x, y, dy, steps = 12, hold = 0 } = options
  const move = (to: number) =>
    cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x, y: to }],
    })
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x, y }],
  })
  for (let step = 1; step <= steps; step++) {
    await move(y + (dy * step) / steps)
  }
  if (hold) {
    // A move to the same point is dropped, so the finger trembles by a pixel while it rests.
    await page.waitForTimeout(hold / 2)
    await move(y + dy + 1)
    await page.waitForTimeout(hold / 2)
    await move(y + dy)
  }
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  })
  await cdp.detach()
}

export {
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
}
