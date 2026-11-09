import { expect, test } from "../fixtures"
import {
  center,
  drag,
  maximum,
  minimum,
  pointOn,
  pressAt,
  status,
  thumbBox,
  track,
  volume,
} from "./slider.helpers"

// Behavior past the WAI-ARIA pattern, tagged `@enhancement`.

test(
  "a dragged range thumb stops at its neighbour, as the APG's multi-thumb slider says",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("slider")
    const from = await center(thumbBox(page, minimum(page)))
    const to = await pointOn(track(page, 1), 0.95)
    await drag(page, from, { x: to.x - from.x })
    await expect(minimum(page)).toHaveValue("80")
    await expect(maximum(page)).toHaveValue("80")
  }
)

test(
  "each range thumb's own range ends at its neighbour",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("slider")
    await expect(minimum(page)).toHaveAttribute("max", "80")
    await expect(maximum(page)).toHaveAttribute("min", "20")
    await minimum(page).focus()
    await page.keyboard.press("ArrowRight")
    await expect(maximum(page)).toHaveAttribute("min", "21")
  }
)

test(
  "a form reset returns every slider to its default",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("slider")
    await volume(page).focus()
    await page.keyboard.press("End")
    await pressAt(page, track(page, 1), 0.5)
    await expect(volume(page)).toHaveValue("100")
    await page.getByRole("button", { name: "Reset" }).click()
    await expect(volume(page)).toHaveValue("50")
    await expect(minimum(page)).toHaveValue("20")
    await expect(maximum(page)).toHaveValue("80")
  }
)

test(
  "holding an arrow key commits once, when the key comes up",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("slider")
    await volume(page).focus()
    await page.keyboard.down("ArrowRight")
    await page.keyboard.down("ArrowRight")
    await page.keyboard.down("ArrowRight")
    await expect(volume(page)).toHaveValue("53")
    expect(await status(page, "Committed")).toBe("")
    await page.keyboard.up("ArrowRight")
    await expect.poll(() => status(page, "Committed")).toBe("volume:53")
  }
)

test(
  "dragging left from stacked thumbs moves the lower one",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("slider", { price: "50,50" })
    const from = await center(thumbBox(page, maximum(page)))
    await drag(page, from, { x: -40 })
    await expect(minimum(page)).toHaveValue("30")
    await expect(maximum(page)).toHaveValue("50")
  }
)

test(
  "pressing the track beside stacked thumbs moves the one on that side",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("slider", { price: "50,50" })
    await pressAt(page, track(page, 1), 0.3)
    await expect(minimum(page)).toHaveValue("30")
    await expect(maximum(page)).toHaveValue("50")
    await expect(minimum(page)).toBeFocused()
  }
)

test(
  "a key moves a thumb as close to its neighbour as the minimum distance allows",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("slider", { price: "20,30", "min-steps": "5" })
    await minimum(page).focus()
    await page.keyboard.press("PageUp")
    await expect(minimum(page)).toHaveValue("25")
  }
)

test(
  "touch drags on the control never scroll the page",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("slider")
    const touchAction = await page
      .locator(".slider-control")
      .first()
      .evaluate((el) => getComputedStyle(el).touchAction)
    expect(touchAction).toBe("none")
  }
)

test(
  "a range submits one start/end value",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("slider")
    await page.getByRole("button", { name: "Save" }).click()
    await expect
      .poll(() => status(page, "Submitted"))
      .toBe("volume=50&price=20%2F80")
  }
)

test(
  "clicking a range's label focuses its first thumb",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("slider")
    await page.getByText("Price", { exact: true }).click()
    await expect(minimum(page)).toBeFocused()
  }
)
