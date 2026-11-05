import type { Page } from "@playwright/test"
import { expect, lastAction, test } from "../fixtures"

// No WAI-ARIA pattern covers a color picker. Its area's thumb is a slider for
// one channel whose text names both, its channels are sliders, and its
// presets are a listbox.

const picker = (page: Page) => page.getByRole("group", { name: "Brand color" })
const areaThumb = (page: Page) => page.getByRole("slider", { name: "Saturation and brightness" })
const slider = (page: Page, name: string) => page.getByRole("slider", { name, exact: true })
const input = (page: Page) => page.getByRole("textbox", { name: "Color value" })
const area = (page: Page) => page.locator('[data-slot="color-picker-area"]')
const committed = (page: Page) => page.getByRole("status", { name: "Committed" }).textContent()
const submitted = async (page: Page) => {
  await page.getByRole("button", { name: "Save" }).click()
  return page.getByRole("status", { name: "Submitted" }).textContent()
}

test.describe("value", () => {
  test("the parts show the default value", async ({ page, open }) => {
    await open("color-picker")
    await expect(picker(page)).toBeVisible()
    await expect(input(page)).toHaveValue("#3b82f6")
    await expect(slider(page, "Hue")).toHaveAttribute("aria-valuetext", "217 degrees")
    await expect(areaThumb(page)).toHaveAttribute("aria-valuetext", "Saturation 76%, Brightness 96%")
  })

  test("a press on the area moves the color there, and commits when it lifts", async ({ page, open }) => {
    await open("color-picker")
    const box = (await area(page).boundingBox())!
    await page.mouse.click(box.x + 1, box.y + 1)
    await expect(areaThumb(page)).toHaveAttribute(
      "aria-valuetext",
      /^Saturation [0-2]%, Brightness (9[89]|100)%$/,
    )
    expect(await lastAction(page)).toMatch(/:track-press$/)
    expect(await committed(page)).toMatch(/:track-press$/)
    await expect(areaThumb(page)).toBeFocused()
  })

  test("a drag along a slider follows the pointer and commits once", async ({ page, open }) => {
    await open("color-picker")
    const track = (await page.locator('[data-slot="color-picker-slider"][data-channel="hue"]').boundingBox())!
    const y = track.y + track.height / 2
    await page.mouse.move(track.x + 2, y)
    await page.mouse.down()
    await page.mouse.move(track.x + track.width / 3, y, { steps: 4 })
    await expect(slider(page, "Hue")).toHaveAttribute("aria-valuenow", /^1[12]\d$/)
    expect(await committed(page)).toBe("")
    await page.mouse.up()
    expect(await committed(page)).toMatch(/:drag$/)
  })

  test("the text input reads any CSS color on Enter, and text that isn't one goes back", async ({
    page,
    open,
  }) => {
    await open("color-picker")
    await input(page).fill("rebeccapurple")
    await input(page).press("Enter")
    await expect(input(page)).toHaveValue("#663399")
    expect(await committed(page)).toBe("#663399:input-commit")
    await input(page).fill("not a color")
    await input(page).press("Tab")
    await expect(input(page)).toHaveValue("#663399")
  })

  test("a channel input sets its channel in its own units", async ({ page, open }) => {
    await open("color-picker")
    const alpha = page.getByRole("spinbutton", { name: "Alpha" })
    await expect(alpha).toHaveValue("100")
    await alpha.fill("50")
    await alpha.press("Enter")
    await expect(input(page)).toHaveValue("#3b82f680")
    await expect(slider(page, "Alpha")).toHaveAttribute("aria-valuetext", "50%")
  })

  test("a controller sets the value, and a canceled change keeps it", async ({ page, open }) => {
    await open("color-picker")
    await page.getByRole("button", { name: "Use purple" }).click()
    await expect(input(page)).toHaveValue("#663399")
    await open("color-picker", { cancel: "" })
    await slider(page, "Hue").focus()
    await page.keyboard.press("End")
    await expect(input(page)).toHaveValue("#3b82f6")
    await expect(slider(page, "Hue")).toHaveAttribute("aria-valuetext", "217 degrees")
  })
})

test.describe("keyboard", () => {
  test("arrows step a slider, Shift ten steps, and each press commits", async ({ page, open }) => {
    await open("color-picker")
    await slider(page, "Hue").focus()
    await page.keyboard.press("ArrowRight")
    await expect(slider(page, "Hue")).toHaveAttribute("aria-valuenow", "218")
    expect(await committed(page)).toMatch(/:step-key$/)
    await page.keyboard.press("Shift+ArrowLeft")
    await expect(slider(page, "Hue")).toHaveAttribute("aria-valuenow", "208")
  })

  test("arrows move the area's thumb on both axes", async ({ page, open }) => {
    await open("color-picker")
    await areaThumb(page).focus()
    await page.keyboard.press("ArrowUp")
    await page.keyboard.press("ArrowLeft")
    await expect(areaThumb(page)).toHaveAttribute("aria-valuetext", "Saturation 75%, Brightness 97%")
  })

  test("swatches are one tab stop, arrows move between them, and a press picks one", async ({
    page,
    open,
  }) => {
    await open("color-picker")
    const red = page.getByRole("option", { name: "vivid red" })
    const green = page.getByRole("option", { name: "green" })
    await red.focus()
    await page.keyboard.press("ArrowRight")
    await expect(green).toBeFocused()
    await page.keyboard.press("Enter")
    await expect(green).toHaveAttribute("aria-selected", "true")
    await expect(input(page)).toHaveValue("#22c55e")
    expect(await lastAction(page)).toBe("#22c55e:item-press")
    await expect(red).toHaveAttribute("tabindex", "-1")
  })
})

test.describe("forms", () => {
  test("the value submits under its name, and a reset returns to the default", async ({ page, open }) => {
    await open("color-picker")
    expect(await submitted(page)).toBe("color=#3b82f6")
    await input(page).fill("#000000")
    await input(page).press("Enter")
    expect(await submitted(page)).toBe("color=#000000")
    await page.getByRole("button", { name: "Reset" }).click()
    await expect(input(page)).toHaveValue("#3b82f6")
  })

  test("a disabled picker can't be focused or changed, and submits nothing", async ({ page, open }) => {
    await open("color-picker", { disabled: "" })
    await expect(slider(page, "Hue")).toHaveAttribute("tabindex", "-1")
    const box = (await area(page).boundingBox())!
    await page.mouse.click(box.x + 1, box.y + 1)
    await expect(input(page)).toHaveValue("#3b82f6")
    expect(await submitted(page)).toBe("")
  })
})

test.describe("gamut", () => {
  test("in OKLCH, a color past the sRGB edge writes the closest one inside, and the thumb moves there once it lifts", async ({
    page,
    open,
  }) => {
    await open("color-picker", { space: "oklch", default: "oklch(0.7 0.1 150)" })
    const thumb = page.getByRole("slider", { name: "Chroma and lightness" })
    const box = (await area(page).boundingBox())!
    const y = box.y + box.height * 0.3
    await page.mouse.move(box.x + box.width / 4, y)
    await page.mouse.down()
    await page.mouse.move(box.x + box.width - 2, y, { steps: 3 })
    await expect(picker(page)).toHaveAttribute("data-out-of-gamut", "")
    await page.mouse.up()
    await expect(picker(page)).not.toHaveAttribute("data-out-of-gamut")
    expect(Number(await thumb.getAttribute("aria-valuenow"))).toBeLessThan(0.3)
  })

  test("the canvas paints the area, with the colors outside the gamut left clear", async ({ page, open }) => {
    await open("color-picker", { space: "oklch", default: "oklch(0.7 0.1 150)" })
    const pixels = await page.locator('[data-slot="color-picker-area-canvas"]').evaluate((canvas) => {
      const context = (canvas as HTMLCanvasElement).getContext("2d")!
      const { width, height } = canvas as HTMLCanvasElement
      const alpha = (x: number, y: number) => context.getImageData(x, y, 1, 1).data[3]
      return { gray: alpha(0, Math.floor(height / 2)), vivid: alpha(width - 1, Math.floor(height / 2)) }
    })
    expect(pixels).toEqual({ gray: 255, vivid: 0 })
  })
})
