import { expect, test } from "../fixtures"
import {
  center,
  drag,
  maximum,
  minimum,
  pressAt,
  thumbBox,
  track,
  volume,
} from "./slider.helpers"

// Right to left, a horizontal slider starts at the right, and Left and Right swap.

test("ArrowLeft increases it and ArrowRight decreases it", async ({
  page,
  open,
}) => {
  await open("slider", { dir: "rtl" })
  await volume(page).focus()
  await page.keyboard.press("ArrowLeft")
  await expect(volume(page)).toHaveValue("51")
  await page.keyboard.press("ArrowRight")
  await page.keyboard.press("ArrowRight")
  await expect(volume(page)).toHaveValue("49")
})

test("the minimum is at the right", async ({ page, open }) => {
  await open("slider", { dir: "rtl" })
  const low = await center(thumbBox(page, minimum(page)))
  const high = await center(thumbBox(page, maximum(page)))
  expect(low.x).toBeGreaterThan(high.x)
  await pressAt(page, track(page, 0), 0.25, { rtl: true })
  await expect(volume(page)).toHaveValue("25")
})

test(
  "thumbs stay centered on their values when the direction changes",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("slider")
    await page.evaluate(() => (document.documentElement.dir = "rtl"))
    const box = (await track(page, 1).boundingBox())!
    // The range's first thumb is at 20, a fifth of the way from the right.
    const low = await center(thumbBox(page, minimum(page)))
    expect(Math.abs(low.x - (box.x + box.width * 0.8))).toBeLessThan(1.5)
  }
)

test("dragging left increases it", async ({ page, open }) => {
  await open("slider", { dir: "rtl" })
  const from = await center(thumbBox(page, volume(page)))
  await drag(page, from, { x: -40 })
  await expect(volume(page)).toHaveValue("70")
})

test(
  "a vertical slider keeps ArrowRight increasing right to left",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("slider", { dir: "rtl", orientation: "vertical" })
    await volume(page).focus()
    await page.keyboard.press("ArrowRight")
    await expect(volume(page)).toHaveValue("51")
  }
)
