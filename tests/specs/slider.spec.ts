import { countFormEvents, expect, formEventCounts, test } from "../fixtures"
import {
  center,
  drag,
  maximum,
  minimum,
  pressAt,
  status,
  thumbBox,
  track,
  volume,
} from "./slider.helpers"

// Behavior follows the WAI-ARIA slider patterns:
// https://www.w3.org/WAI/ARIA/apg/patterns/slider/
// https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/

test.describe("keyboard", () => {
  test.beforeEach(async ({ open }) => {
    await open("slider")
  })

  test("starts at its default value", async ({ page }) => {
    await expect(volume(page)).toHaveValue("50")
    await expect(minimum(page)).toHaveValue("20")
    await expect(maximum(page)).toHaveValue("80")
  })

  test("ArrowRight and ArrowUp increase it by one step", async ({ page }) => {
    await volume(page).focus()
    await page.keyboard.press("ArrowRight")
    await expect(volume(page)).toHaveValue("51")
    await page.keyboard.press("ArrowUp")
    await expect(volume(page)).toHaveValue("52")
    expect(await status(page, "Last action")).toBe("volume:52")
  })

  test("ArrowLeft and ArrowDown decrease it by one step", async ({ page }) => {
    await volume(page).focus()
    await page.keyboard.press("ArrowLeft")
    await expect(volume(page)).toHaveValue("49")
    await page.keyboard.press("ArrowDown")
    await expect(volume(page)).toHaveValue("48")
  })

  test("Page Up and Page Down move by the large step", async ({ page }) => {
    await volume(page).focus()
    await page.keyboard.press("PageUp")
    await expect(volume(page)).toHaveValue("60")
    await page.keyboard.press("PageDown")
    await page.keyboard.press("PageDown")
    await expect(volume(page)).toHaveValue("40")
  })

  test("Shift with an arrow key moves by the large step", async ({ page }) => {
    await volume(page).focus()
    await page.keyboard.press("Shift+ArrowRight")
    await expect(volume(page)).toHaveValue("60")
    await page.keyboard.press("Shift+ArrowLeft")
    await expect(volume(page)).toHaveValue("50")
  })

  test("Home and End go to the minimum and the maximum", async ({ page }) => {
    await volume(page).focus()
    await page.keyboard.press("End")
    await expect(volume(page)).toHaveValue("100")
    await page.keyboard.press("Home")
    await expect(volume(page)).toHaveValue("0")
  })

  test("a value never goes past the bounds", async ({ page, open }) => {
    await open("slider", { volume: "99" })
    await volume(page).focus()
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("ArrowRight")
    await expect(volume(page)).toHaveValue("100")
  })

  test("Tab moves through the thumbs in order", async ({ page, tab }) => {
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(volume(page)).toBeFocused()
    await tab()
    await expect(minimum(page)).toBeFocused()
    await tab()
    await expect(maximum(page)).toBeFocused()
  })

  test("Home and End move a range thumb as far as its neighbour", async ({
    page,
  }) => {
    await maximum(page).focus()
    await page.keyboard.press("Home")
    await expect(maximum(page)).toHaveValue("20")
    await minimum(page).focus()
    await page.keyboard.press("Home")
    await expect(minimum(page)).toHaveValue("0")
    await page.keyboard.press("End")
    await expect(minimum(page)).toHaveValue("20")
  })

  test("a range thumb stops at its neighbour", async ({ page, open }) => {
    await open("slider", { price: "49,51" })
    await minimum(page).focus()
    for (let index = 0; index < 4; index++) {
      await page.keyboard.press("ArrowRight")
    }
    await expect(minimum(page)).toHaveValue("51")
    await expect(maximum(page)).toHaveValue("51")
  })

  test("a canceled change keeps the value", async ({ page, open }) => {
    await open("slider", { cancel: "volume" })
    await volume(page).focus()
    await page.keyboard.press("ArrowRight")
    await expect(volume(page)).toHaveValue("50")
  })

  test("a controlled slider follows its value", async ({ page, open }) => {
    await open("slider", { controlled: "" })
    await volume(page).focus()
    await page.keyboard.press("ArrowRight")
    await expect(volume(page)).toHaveValue("51")
  })
})

test.describe("pointer", () => {
  test.beforeEach(async ({ open }) => {
    await open("slider")
  })

  test("pressing the track moves the thumb there", async ({ page }) => {
    await pressAt(page, track(page, 0), 0.25)
    await expect(volume(page)).toHaveValue("25")
    expect(await status(page, "Last action")).toBe("volume:25")
  })

  test("pressing the track focuses the thumb", async ({ page }) => {
    await pressAt(page, track(page, 0), 0.8)
    await expect(volume(page)).toBeFocused()
  })

  test("pressing a range's track moves the nearest thumb", async ({ page }) => {
    await pressAt(page, track(page, 1), 0.3)
    await expect(minimum(page)).toHaveValue("30")
    await expect(maximum(page)).toHaveValue("80")
    await pressAt(page, track(page, 1), 0.7)
    await expect(maximum(page)).toHaveValue("70")
    await expect(maximum(page)).toBeFocused()
  })

  test("dragging a thumb follows the pointer", async ({ page }) => {
    const from = await center(thumbBox(page, volume(page)))
    await drag(page, from, { x: 40 })
    await expect(volume(page)).toHaveValue("70")
  })

  test("grabbing a thumb off center doesn't move it", async ({ page }) => {
    const middle = await center(thumbBox(page, volume(page)))
    await page.mouse.move(middle.x + 5, middle.y)
    await page.mouse.down()
    await expect(volume(page)).toHaveValue("50")
    await page.mouse.move(middle.x + 25, middle.y, { steps: 4 })
    await expect(volume(page)).toHaveValue("60")
    await page.mouse.up()
  })

  test("dragging past the end stops at the bound", async ({ page }) => {
    const from = await center(thumbBox(page, volume(page)))
    await drag(page, from, { x: 400 })
    await expect(volume(page)).toHaveValue("100")
  })

  test("dragging continues outside the slider", async ({ page }) => {
    const from = await center(thumbBox(page, volume(page)))
    await page.mouse.move(from.x, from.y)
    await page.mouse.down()
    await page.mouse.move(from.x + 20, from.y + 150, { steps: 6 })
    await expect(volume(page)).toHaveValue("60")
    await page.mouse.up()
  })

  test("dragging right from stacked thumbs moves the upper one", async ({
    page,
    open,
  }) => {
    await open("slider", { price: "50,50" })
    const from = await center(thumbBox(page, minimum(page)))
    await drag(page, from, { x: 40 })
    await expect(minimum(page)).toHaveValue("50")
    await expect(maximum(page)).toHaveValue("70")
  })

  test("the value commits once, when the pointer lifts", async ({ page }) => {
    const from = await center(thumbBox(page, volume(page)))
    await page.mouse.move(from.x, from.y)
    await page.mouse.down()
    await page.mouse.move(from.x + 20, from.y, { steps: 4 })
    await page.mouse.move(from.x + 40, from.y, { steps: 4 })
    expect(await status(page, "Committed")).toBe("")
    await page.mouse.up()
    await expect.poll(() => status(page, "Committed")).toBe("volume:70")
  })

  test("a screen reader's adjustment reaches the form as one input and one change", async ({
    page,
  }) => {
    await countFormEvents(page)
    // A screen reader sets the range input's value and fires its native events.
    await volume(page).evaluate((el) => {
      const input = el as HTMLInputElement
      input.value = "70"
      input.dispatchEvent(new Event("input", { bubbles: true }))
      input.dispatchEvent(new Event("change", { bubbles: true }))
    })
    await expect(volume(page)).toHaveValue("70")
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve)))
    expect(await formEventCounts(page)).toEqual({ input: 1, change: 1 })
  })

  test("a drag sends input as it moves, and change once when the pointer lifts", async ({
    page,
  }) => {
    await countFormEvents(page)
    const from = await center(thumbBox(page, volume(page)))
    await page.mouse.move(from.x, from.y)
    await page.mouse.down()
    await page.mouse.move(from.x + 40, from.y, { steps: 8 })
    await expect
      .poll(async () => (await formEventCounts(page)).input)
      .toBeGreaterThan(0)
    expect((await formEventCounts(page)).change).toBe(0)
    await page.mouse.up()
    await expect.poll(async () => (await formEventCounts(page)).change).toBe(1)
  })

  test("pressing a thumb without moving commits nothing", async ({ page }) => {
    await thumbBox(page, volume(page)).click()
    await expect(volume(page)).toBeFocused()
    expect(await status(page, "Committed")).toBe("")
  })

  test("a press on the track commits", async ({ page }) => {
    await pressAt(page, track(page, 0), 0.25)
    await expect.poll(() => status(page, "Committed")).toBe("volume:25")
  })

  test("the thumb sits at its value along the track", async ({ page }) => {
    const box = (await track(page, 0).boundingBox())!
    const thumb = await center(thumbBox(page, volume(page)))
    expect(Math.abs(thumb.x - (box.x + box.width / 2))).toBeLessThan(1.5)
    const low = await center(thumbBox(page, minimum(page)))
    const range = (await track(page, 1).boundingBox())!
    expect(Math.abs(low.x - (range.x + range.width * 0.2))).toBeLessThan(1.5)
  })
})

test.describe("vertical", () => {
  test.beforeEach(async ({ open }) => {
    await open("slider", { orientation: "vertical" })
  })

  test("it says it's vertical", async ({ page }) => {
    await expect(volume(page)).toHaveAttribute("aria-orientation", "vertical")
  })

  test("ArrowUp increases it and ArrowDown decreases it", async ({ page }) => {
    await volume(page).focus()
    await page.keyboard.press("ArrowUp")
    await expect(volume(page)).toHaveValue("51")
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("ArrowDown")
    await expect(volume(page)).toHaveValue("49")
  })

  test("the bottom is the minimum", async ({ page }) => {
    await pressAt(page, track(page, 0), 0.25, { vertical: true })
    await expect(volume(page)).toHaveValue("25")
  })

  test("dragging up increases it", async ({ page }) => {
    const from = await center(thumbBox(page, volume(page)))
    await drag(page, from, { y: -40 })
    await expect(volume(page)).toHaveValue("70")
  })
})

test.describe("value and state", () => {
  test("the value part shows the value, and a range joined with a dash", async ({
    page,
    open,
  }) => {
    await open("slider")
    await expect(page.locator(".slider-value").nth(0)).toHaveText("50")
    await expect(page.locator(".slider-value").nth(1)).toHaveText("20 – 80")
    await volume(page).focus()
    await page.keyboard.press("ArrowRight")
    await expect(page.locator(".slider-value").nth(0)).toHaveText("51")
  })

  test("the value reads in the format and the locale", async ({
    page,
    open,
  }) => {
    await open("slider", { currency: "", locale: "de-DE" })
    await expect(minimum(page)).toHaveAttribute("aria-valuetext", /^20,00\s€/)
    await expect(page.locator(".slider-value").nth(1)).toHaveText(
      /^20,00\s€ – 80,00\s€$/
    )
  })

  test("a disabled slider can't be focused or changed", async ({
    page,
    open,
  }) => {
    await open("slider", { disabled: "" })
    await expect(volume(page)).toBeDisabled()
    await pressAt(page, track(page, 0), 0.9)
    await expect(volume(page)).toHaveValue("50")
  })

  test("its parts say when it's dragged", async ({ page, open }) => {
    await open("slider")
    const box = thumbBox(page, volume(page))
    const from = await center(box)
    await page.mouse.move(from.x, from.y)
    await page.mouse.down()
    await page.mouse.move(from.x + 10, from.y, { steps: 2 })
    await expect(box).toHaveAttribute("data-dragging", "")
    await page.mouse.up()
    await expect(box).not.toHaveAttribute("data-dragging", "")
  })

  test("a single slider submits its value under its name", async ({
    page,
    open,
  }) => {
    await open("slider")
    await volume(page).focus()
    await page.keyboard.press("ArrowRight")
    await page.getByRole("button", { name: "Save" }).click()
    await expect.poll(() => status(page, "Submitted")).toMatch(/^volume=51/)
  })
})
