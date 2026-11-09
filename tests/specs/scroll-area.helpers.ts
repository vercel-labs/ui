import type { Locator, Page } from "@playwright/test"
import { expect } from "../fixtures"

// Viewports are regions named by the fixture. Scrollbars are hidden from
// assistive technology, so they're found by class inside their scroll area.

const viewport = (page: Page, name: string) =>
  page.getByRole("region", { name, exact: true })

const area = (page: Page, name: string) =>
  viewport(page, name).locator("xpath=..")

const scrollbar = (page: Page, name: string, orientation = "vertical") =>
  area(page, name).locator(
    `.scroll-area-scrollbar[data-orientation="${orientation}"]`
  )

const thumb = (page: Page, name: string, orientation = "vertical") =>
  scrollbar(page, name, orientation).locator(".scroll-area-thumb")

function scrollOf(locator: Locator) {
  return locator.evaluate((el) => ({
    top: el.scrollTop,
    left: el.scrollLeft,
    maxTop: el.scrollHeight - el.clientHeight,
    maxLeft: el.scrollWidth - el.clientWidth,
    client: el.clientHeight,
  }))
}

// Where a scroll comes to rest. WebKit on Linux animates wheel scrolls, so a
// position read right after the wheel is still moving.
function restingScroll(locator: Locator) {
  return locator.evaluate(
    (el) =>
      new Promise<number>((resolve) => {
        let last = el.scrollTop
        let still = 0
        const check = () => {
          still = el.scrollTop === last ? still + 1 : 0
          last = el.scrollTop
          if (still >= 5) {
            resolve(last)
          } else {
            requestAnimationFrame(check)
          }
        }
        requestAnimationFrame(check)
      })
  )
}

async function setScroll(
  locator: Locator,
  position: { top?: number; left?: number }
) {
  await locator.evaluate(
    (el, position) => el.scrollTo({ ...position, behavior: "instant" }),
    position
  )
}

// Two frames: one for the scroll event, one for the writes it schedules.
async function settle(page: Page) {
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve))
      )
  )
}

async function box(locator: Locator) {
  const result = await locator.boundingBox()
  expect(result).not.toBeNull()
  return result!
}

// The track's content box, inside the scrollbar's 2px padding from the fixture styles.
async function trackBox(page: Page, name: string, orientation = "vertical") {
  // Scrollbars stop short of the corner a frame or two after they measure
  // each other, so wait for the box to hold still.
  let bar = await box(scrollbar(page, name, orientation))
  for (let attempt = 0; attempt < 10; attempt++) {
    await settle(page)
    const next = await box(scrollbar(page, name, orientation))
    if (
      next.x === bar.x &&
      next.width === bar.width &&
      next.height === bar.height
    ) {
      break
    }
    bar = next
  }
  return {
    x: bar.x + 2,
    y: bar.y + 2,
    width: bar.width - 4,
    height: bar.height - 4,
  }
}

async function dragBy(page: Page, target: Locator, dx: number, dy: number) {
  await settle(page)
  const from = await box(target)
  const x = from.x + from.width / 2
  const y = from.y + from.height / 2
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x + dx / 2, y + dy / 2, { steps: 4 })
  await page.mouse.move(x + dx, y + dy, { steps: 4 })
  return { x: x + dx, y: y + dy }
}

// Moves the mouse over a scrollbar the way a user would, through its scroll
// area, which shows scrollbars that hide until hovered.
async function pointAt(page: Page, target: Locator) {
  const { x, y, width, height } = await box(target)
  await page.mouse.move(x + width / 2, y + height / 2, { steps: 2 })
}

export {
  area,
  box,
  dragBy,
  pointAt,
  restingScroll,
  scrollbar,
  scrollOf,
  setScroll,
  settle,
  thumb,
  trackBox,
  viewport,
}
