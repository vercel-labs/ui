import type { Page } from "@playwright/test"
import { expect, lastAction, test } from "../fixtures"

// No WAI-ARIA pattern covers an image cropper. Its selection and handles are
// sliders whose text says the crop, and the zoom is a range input.

const cropper = (page: Page) => page.getByRole("group", { name: "Photo" })
const selection = (page: Page) => page.getByRole("slider", { name: "Crop" })
const handle = (page: Page, name: string) => page.getByRole("slider", { name })
const zoom = (page: Page) => page.getByRole("slider", { name: "Zoom" })
const viewport = (page: Page) =>
  page.locator('[data-slot="image-cropper-viewport"]')
const committed = (page: Page) =>
  page.getByRole("status", { name: "Committed" }).textContent()

async function drag(
  page: Page,
  from: { x: number; y: number },
  by: { x: number; y: number }
) {
  await page.mouse.move(from.x, from.y)
  await page.mouse.down()
  await page.mouse.move(from.x + by.x, from.y + by.y, { steps: 5 })
}

async function centerOf(locator: ReturnType<Page["locator"]>) {
  const box = (await locator.boundingBox())!
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 }
}

test.describe("loading", () => {
  test("the crop starts once the image loads, as four fifths of the largest at the ratio", async ({
    page,
    open,
  }) => {
    await open("image-cropper", { aspect: "1" })
    await expect(cropper(page)).not.toHaveAttribute("aria-busy")
    await expect(selection(page)).toHaveAttribute(
      "aria-valuetext",
      "240 by 240 pixels, at 80, 30"
    )
    expect(await lastAction(page)).toBe("80,30,240,240 r0:image-load")
    expect(await committed(page)).toBe("80,30,240,240 r0:image-load")
    const box = (await selection(page).boundingBox())!
    const frame = (await viewport(page).boundingBox())!
    expect(Math.round(box.x - frame.x)).toBe(80)
    expect(Math.round(box.width)).toBe(240)
  })
})

test.describe("box", () => {
  test("a drag moves the selection over the image and commits once", async ({
    page,
    open,
  }) => {
    await open("image-cropper", { default: "100,50,100,100" })
    await expect(selection(page)).toHaveAttribute("aria-valuenow", "100")
    await drag(page, await centerOf(selection(page)), { x: 50, y: 30 })
    // Moves land once a frame, so the last one can still be on its way.
    await expect.poll(() => lastAction(page)).toBe("150,80,100,100 r0:drag")
    expect(await committed(page)).toBe("")
    await page.mouse.up()
    expect(await committed(page)).toBe("150,80,100,100 r0:drag")
  })

  test("a handle resizes from its corner, within the image", async ({
    page,
    open,
  }) => {
    await open("image-cropper", { default: "100,50,100,100" })
    await drag(page, await centerOf(handle(page, "Bottom right corner")), {
      x: 40,
      y: 20,
    })
    await page.mouse.up()
    await expect(selection(page)).toHaveAttribute(
      "aria-valuetext",
      "140 by 120 pixels, at 100, 50"
    )
    // Past the image but not the window, which Playwright's Firefox can't move outside.
    await drag(page, await centerOf(handle(page, "Top left corner")), {
      x: -150,
      y: -60,
    })
    await page.mouse.up()
    await expect(selection(page)).toHaveAttribute(
      "aria-valuetext",
      "240 by 170 pixels, at 0, 0"
    )
  })

  test("at a ratio, a handle keeps it", async ({ page, open }) => {
    await open("image-cropper", { aspect: "1", default: "100,50,100,100" })
    await drag(page, await centerOf(handle(page, "Right edge")), {
      x: 50,
      y: 0,
    })
    await page.mouse.up()
    await expect(selection(page)).toHaveAttribute(
      "aria-valuetext",
      "150 by 150 pixels, at 100, 25"
    )
  })

  test("Escape during a drag puts the selection back", async ({
    page,
    open,
  }) => {
    await open("image-cropper", { default: "100,50,100,100" })
    await drag(page, await centerOf(selection(page)), { x: 50, y: 30 })
    await page.keyboard.press("Escape")
    await page.mouse.up()
    await expect(selection(page)).toHaveAttribute(
      "aria-valuetext",
      "100 by 100 pixels, at 100, 50"
    )
    expect(await committed(page)).toBe("")
  })
})

test.describe("keyboard", () => {
  test("arrows move the selection, ten times as far with Shift", async ({
    page,
    open,
  }) => {
    await open("image-cropper", { default: "100,50,100,100" })
    await page.getByRole("button", { name: "Before" }).focus()
    await page.keyboard.press("Tab")
    await expect(selection(page)).toBeFocused()
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("Shift+ArrowDown")
    await expect(selection(page)).toHaveAttribute(
      "aria-valuetext",
      "100 by 100 pixels, at 101, 60"
    )
    expect(await committed(page)).toBe("101,60,100,100 r0:step-key")
  })

  test("arrows on a handle move its edges, and the next Tab reaches it", async ({
    page,
    open,
  }) => {
    await open("image-cropper", { default: "100,50,100,100" })
    await selection(page).focus()
    await page.keyboard.press("Tab")
    await expect(handle(page, "Top left corner")).toBeFocused()
    await handle(page, "Right edge").focus()
    await page.keyboard.press("Shift+ArrowRight")
    await page.keyboard.press("ArrowDown")
    await expect(selection(page)).toHaveAttribute(
      "aria-valuetext",
      "110 by 100 pixels, at 100, 50"
    )
  })

  test("plus and minus zoom about the middle, and R turns the image", async ({
    page,
    open,
  }) => {
    await open("image-cropper", { aspect: "1" })
    await selection(page).focus()
    await page.keyboard.press("+")
    await expect(selection(page)).toHaveAttribute(
      "aria-valuetext",
      "192 by 192 pixels, at 104, 54"
    )
    await expect(zoom(page)).toHaveAttribute("aria-valuetext", "156%")
    await page.keyboard.press("-")
    await expect(selection(page)).toHaveAttribute(
      "aria-valuetext",
      "240 by 240 pixels, at 80, 30"
    )
    await page.keyboard.press("r")
    expect(await lastAction(page)).toBe("30,80,240,240 r90:rotate-key")
  })
})

test.describe("controls", () => {
  test("the zoom input zooms the crop", async ({ page, open }) => {
    await open("image-cropper", { aspect: "1" })
    await zoom(page).fill("2")
    await expect(selection(page)).toHaveAttribute(
      "aria-valuetext",
      "150 by 150 pixels, at 125, 75"
    )
    expect(await lastAction(page)).toMatch(/:zoom-input$/)
  })

  test("rotate turns the image a quarter clockwise, and flip mirrors it", async ({
    page,
    open,
  }) => {
    await open("image-cropper", { default: "0,0,100,50" })
    await page.getByRole("button", { name: "Rotate" }).click()
    expect(await committed(page)).toBe("250,0,50,100 r90:rotate-press")
    await page.getByRole("button", { name: "Flip" }).click()
    expect(await committed(page)).toBe("0,0,50,100 r90 fx:flip-press")
    const image = page.getByRole("img", { name: "Four colored squares" })
    await expect(image).toHaveCSS("transform", /^matrix\(/)
  })

  test("a controller sets the crop, and a canceled change keeps it", async ({
    page,
    open,
  }) => {
    await open("image-cropper")
    await page.getByRole("button", { name: "Use corner" }).click()
    await expect(selection(page)).toHaveAttribute(
      "aria-valuetext",
      "100 by 100 pixels, at 0, 0"
    )
    await open("image-cropper", { cancel: "", default: "100,50,100,100" })
    await selection(page).focus()
    await page.keyboard.press("ArrowRight")
    await expect(selection(page)).toHaveAttribute(
      "aria-valuetext",
      "100 by 100 pixels, at 100, 50"
    )
  })

  test("disabled, nothing takes focus or changes", async ({
    page,
    open,
    tab,
  }) => {
    await open("image-cropper", { disabled: "" })
    await expect(cropper(page)).toHaveAttribute("data-disabled", "")
    await expect(page.getByRole("button", { name: "Rotate" })).toBeDisabled()
    await expect(zoom(page)).toBeDisabled()
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(page.getByRole("button", { name: "After" })).toBeFocused()
  })
})

test.describe("frame", () => {
  test("the selection stays put and a drag pans the image under it", async ({
    page,
    open,
  }) => {
    await open("image-cropper", { mode: "frame", aspect: "1" })
    await expect(selection(page)).toHaveAttribute("aria-valuenow", "50")
    await expect(handle(page, "Right edge")).toBeHidden()
    const before = (await selection(page).boundingBox())!
    await drag(page, await centerOf(viewport(page)), { x: 40, y: 0 })
    expect(await lastAction(page)).toBe("10,0,300,300 r0:drag")
    await page.mouse.up()
    expect(await committed(page)).toBe("10,0,300,300 r0:drag")
    expect(await selection(page).boundingBox()).toEqual(before)
  })

  test("Escape during a pan puts the image back", async ({ page, open }) => {
    await open("image-cropper", { mode: "frame", aspect: "1" })
    await drag(page, await centerOf(viewport(page)), { x: 40, y: 0 })
    await page.keyboard.press("Escape")
    await page.mouse.up()
    await expect(selection(page)).toHaveAttribute("aria-valuenow", "50")
    expect(await committed(page)).toBe("50,0,300,300 r0:image-load")
  })

  test("the wheel zooms at the pointer and commits after a pause", async ({
    page,
    open,
  }) => {
    await open("image-cropper", { mode: "frame", aspect: "1" })
    const frame = (await viewport(page).boundingBox())!
    await page.mouse.move(frame.x + 50, frame.y + 150)
    await page.mouse.wheel(0, -50)
    await expect(selection(page)).not.toHaveAttribute(
      "aria-valuetext",
      "300 by 300 pixels, at 50, 0"
    )
    expect(await lastAction(page)).toMatch(/^50,\d+,\d+,\d+ r0:wheel$/)
    await expect.poll(() => committed(page)).toMatch(/:wheel$/)
  })
})
