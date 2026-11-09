import type { Locator, Page } from "@playwright/test"

// Thumbs are found by role and name: the field's label for a single thumb,
// and each thumb's own label in a range.
const thumb = (page: Page, name: string) =>
  page.getByRole("slider", { name, exact: true })
const volume = (page: Page) => thumb(page, "Volume")
const minimum = (page: Page) => thumb(page, "Minimum price")
const maximum = (page: Page) => thumb(page, "Maximum price")

// Tracks have no role. Every implementation gives them this class, in fixture order.
const track = (page: Page, index: 0 | 1) =>
  page.locator(".slider-track").nth(index)

async function status(
  page: Page,
  name: "Last action" | "Committed" | "Submitted"
) {
  return page.getByRole("status", { name }).textContent()
}

// The point at a fraction of a track, from its start: left to right, right to
// left, or bottom to top.
async function pointOn(
  locator: Locator,
  fraction: number,
  { rtl = false, vertical = false } = {}
) {
  const box = (await locator.boundingBox())!
  if (vertical) {
    return { x: box.x + box.width / 2, y: box.y + box.height * (1 - fraction) }
  }
  const along = rtl ? 1 - fraction : fraction
  return { x: box.x + box.width * along, y: box.y + box.height / 2 }
}

async function pressAt(
  page: Page,
  locator: Locator,
  fraction: number,
  options = {}
) {
  const point = await pointOn(locator, fraction, options)
  await page.mouse.click(point.x, point.y)
}

// The center of an element, like a thumb.
async function center(locator: Locator) {
  const box = (await locator.boundingBox())!
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 }
}

// Drags from a point by an offset, in steps, so every engine sends moves.
async function drag(
  page: Page,
  from: { x: number; y: number },
  by: { x?: number; y?: number }
) {
  await page.mouse.move(from.x, from.y)
  await page.mouse.down()
  await page.mouse.move(from.x + (by.x ?? 0), from.y + (by.y ?? 0), {
    steps: 8,
  })
  await page.mouse.up()
}

// The thumb element around a thumb's input. Every implementation gives it this class.
const thumbBox = (page: Page, slider: Locator) =>
  page.locator(".slider-thumb").filter({ has: slider })

export {
  center,
  drag,
  maximum,
  minimum,
  pointOn,
  pressAt,
  status,
  thumb,
  thumbBox,
  track,
  volume,
}
