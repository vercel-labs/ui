import { scrollAreaFixture } from "../fixtures/scroll-area"
import { expect, test } from "../fixtures"
import {
  area,
  box,
  dragBy,
  pointAt,
  scrollbar,
  scrollOf,
  setScroll,
  thumb,
  trackBox,
  viewport,
} from "./scroll-area.helpers"

// Right to left, the inline start is on the right: scrollLeft runs from 0 to
// minus the maximum, and the horizontal thumb starts at the right.

const { gallery } = scrollAreaFixture

test.beforeEach(async ({ open }) => {
  await open("scroll-area", { dir: "rtl" })
})

test("the vertical scrollbar sits on the left", async ({ page }) => {
  const root = await box(area(page, gallery.label))
  const bar = await box(scrollbar(page, gallery.label))
  expect(Math.abs(bar.x - root.x)).toBeLessThan(2)
})

test("the horizontal thumb starts at the right end of its track", async ({ page }) => {
  const track = await trackBox(page, gallery.label, "horizontal")
  const handle = await box(thumb(page, gallery.label, "horizontal"))
  expect(Math.abs(handle.x + handle.width - (track.x + track.width))).toBeLessThan(2)
})

test("scrolling toward the inline end moves the thumb left", async ({ page }) => {
  const before = await box(thumb(page, gallery.label, "horizontal"))
  await setScroll(viewport(page, gallery.label), { left: -200 })
  await expect
    .poll(async () => (await box(thumb(page, gallery.label, "horizontal"))).x)
    .toBeLessThan(before.x)
})

test("at the inline end, the thumb is at the left end of its track", async ({ page }) => {
  await setScroll(viewport(page, gallery.label), { left: -1e6 })
  const track = await trackBox(page, gallery.label, "horizontal")
  await expect
    .poll(async () => Math.abs((await box(thumb(page, gallery.label, "horizontal"))).x - track.x))
    .toBeLessThan(2)
})

test("dragging the thumb left scrolls toward the inline end", async ({ page }) => {
  await trackBox(page, gallery.label, "horizontal")
  await dragBy(page, thumb(page, gallery.label, "horizontal"), -40, 0)
  await page.mouse.up()
  await expect.poll(async () => (await scrollOf(viewport(page, gallery.label))).left).toBeLessThan(-10)
})

test("pressing the track left of the thumb scrolls toward the inline end", async ({ page }) => {
  const track = await trackBox(page, gallery.label, "horizontal")
  // Over the area first, which shows its scrollbars.
  await pointAt(page, viewport(page, gallery.label))
  await page.mouse.click(track.x + 4, track.y + track.height / 2)
  await expect.poll(async () => (await scrollOf(viewport(page, gallery.label))).left).toBeLessThan(0)
})

test("dragging the thumb follows the page when it turns right to left after mount", async ({
  page,
  open,
}) => {
  await open("scroll-area")
  await trackBox(page, gallery.label, "horizontal")
  await page.evaluate(() => (document.documentElement.dir = "rtl"))
  await dragBy(page, thumb(page, gallery.label, "horizontal"), -40, 0)
  await page.mouse.up()
  await expect.poll(async () => (await scrollOf(viewport(page, gallery.label))).left).toBeLessThan(-10)
})

test("the thumb follows scrolling when the page turns right to left after mount", async ({ page, open }) => {
  await open("scroll-area")
  await trackBox(page, gallery.label, "horizontal")
  await page.evaluate(() => (document.documentElement.dir = "rtl"))
  await setScroll(viewport(page, gallery.label), { left: -1e6 })
  const track = await trackBox(page, gallery.label, "horizontal")
  await expect
    .poll(async () => Math.abs((await box(thumb(page, gallery.label, "horizontal"))).x - track.x))
    .toBeLessThan(2)
})
