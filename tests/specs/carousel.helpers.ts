import type { Page } from "@playwright/test"
import { expect } from "../fixtures"
import { carouselFixture } from "../fixtures/carousel"

// Slides are found by the link inside each, out of view too, where it's hidden.
function slideLink(page: Page, index: number) {
  return page.getByRole("link", {
    name: carouselFixture.slides[index].link,
    includeHidden: true,
  })
}

// Waits until the slides at `indexes` show whole, and the others don't show at all.
async function expectShown(page: Page, ...indexes: number[]) {
  for (let index = 0; index < carouselFixture.slides.length; index++) {
    if (indexes.includes(index)) {
      await expect(slideLink(page, index)).toBeInViewport({ ratio: 1 })
    } else {
      await expect(slideLink(page, index)).not.toBeInViewport()
    }
  }
}

const previousButton = (page: Page) =>
  page.getByRole("button", { name: carouselFixture.previous })
const nextButton = (page: Page) =>
  page.getByRole("button", { name: carouselFixture.next })

const indicator = (page: Page, number: number) =>
  page.getByRole("tab", {
    name: carouselFixture.indicator(number),
    exact: true,
  })

const playToggle = (page: Page, playing: boolean) =>
  page.getByRole("button", {
    name: playing ? carouselFixture.stop : carouselFixture.start,
  })

async function lastReason(page: Page) {
  return page.getByRole("status", { name: "Last reason" }).textContent()
}

// Drags across the viewport with a mouse, from the middle of slide `from`, by
// `distance` px along the axis. `stepDelay` makes a slow drag, with no fling.
async function drag(
  page: Page,
  from: number,
  distance: number,
  { steps = 12, axis = "x", stepDelay = 0 } = {}
) {
  const box = await slideLink(page, from).locator("..").boundingBox()
  if (!box) {
    throw new Error("The slide isn't laid out.")
  }
  const x = box.x + box.width / 2
  const y = box.y + box.height / 2
  await page.mouse.move(x, y)
  await page.mouse.down()
  for (let step = 1; step <= steps; step++) {
    const travelled = (distance * step) / steps
    await page.mouse.move(
      axis === "x" ? x + travelled : x,
      axis === "y" ? y + travelled : y
    )
    if (stepDelay) {
      await page.waitForTimeout(stepDelay)
    }
  }
  await page.mouse.up()
}

// Waits for scrolling and springs to finish: the scroll position holds still for a few frames.
async function settled(page: Page) {
  await page.waitForFunction(
    () =>
      new Promise<boolean>((resolve) => {
        const scrollers = [
          ...document.querySelectorAll<HTMLElement>("*"),
        ].filter(
          (el) =>
            el.scrollWidth > el.clientWidth + 1 ||
            el.scrollHeight > el.clientHeight + 1
        )
        const read = () =>
          scrollers.map((el) => `${el.scrollLeft},${el.scrollTop}`).join(";")
        const first = read()
        let frames = 0
        const check = () => {
          if (read() !== first) {
            return resolve(false)
          }
          if (++frames >= 6) {
            return resolve(true)
          }
          requestAnimationFrame(check)
        }
        requestAnimationFrame(check)
      })
  )
}

// Starts watching how far the slides in view move back toward the start of a
// horizontal carousel in one frame. The returned function reads the most, in px,
// so a spec can check the carousel never ran back the other way.
async function watchBackward(page: Page) {
  await page.evaluate(() => {
    const slides = [
      ...document.querySelectorAll<HTMLElement>(
        "[aria-roledescription='slide']"
      ),
    ]
    const viewport = slides[0].closest<HTMLElement>(
      "[aria-roledescription='carousel']"
    )!
    const rtl = getComputedStyle(viewport).direction === "rtl"
    const read = () => {
      const bounds = viewport.getBoundingClientRect()
      return slides.map((slide) => {
        const box = slide.getBoundingClientRect()
        return box.right > bounds.left && box.left < bounds.right
          ? box.left
          : null
      })
    }
    let most = 0
    let last = read()
    const sample = () => {
      const now = read()
      now.forEach((x, index) => {
        const before = last[index]
        if (x !== null && before !== null) {
          most = Math.max(most, (x - before) * (rtl ? -1 : 1))
        }
      })
      last = now
      requestAnimationFrame(sample)
    }
    requestAnimationFrame(sample)
    Object.assign(window, { carouselBackward: () => most })
  })
  return () =>
    page.evaluate(() =>
      (
        window as unknown as { carouselBackward: () => number }
      ).carouselBackward()
    )
}

export {
  drag,
  expectShown,
  indicator,
  lastReason,
  nextButton,
  playToggle,
  previousButton,
  settled,
  slideLink,
  watchBackward,
}
