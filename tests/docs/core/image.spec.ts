import { expect, test, type Locator } from "@playwright/test"
import { openExamples } from "./behaviors/helpers"

// The cropped image's size and the color of its top-left and center pixels.
const pixels = (example: Locator) =>
  example
    .getByRole("img", { name: "The cropped image" })
    .evaluate(async (image: HTMLImageElement) => {
      await image.decode()
      const canvas = document.createElement("canvas")
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      const context = canvas.getContext("2d")!
      context.drawImage(image, 0, 0)
      const at = (x: number, y: number) =>
        Array.from(context.getImageData(x, y, 1, 1).data).join(",")
      return {
        width: image.naturalWidth,
        height: image.naturalHeight,
        corner: at(0, 0),
        center: at(48, 48),
      }
    })

test("every example renders without errors", async ({ page }) => {
  const { errors } = await openExamples(page, "/docs/core/image")
  await expect(page.locator("[data-example]")).toHaveCount(1)
  expect(errors).toEqual([])
})

test("crop: the top-left square of the turned image becomes a 96 pixel PNG", async ({
  page,
}) => {
  await openExamples(page, "/docs/core/image")
  const example = page.locator("[data-example]")
  await example.getByRole("button", { name: "Crop" }).click()
  const log = example
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()
  await expect(log).toHaveText(/^image\.png, image\/png, \d+ bytes$/)
  expect(await pixels(example)).toMatchObject({
    width: 96,
    height: 96,
    center: "239,68,68,255",
  })

  await example.getByLabel("Rotation").selectOption("90")
  await example.getByRole("button", { name: "Crop" }).click()
  await expect
    .poll(async () => (await pixels(example)).center)
    .toBe("59,130,246,255")

  await example.getByLabel("Rotation").selectOption("0")
  await example.getByLabel("Flip").check()
  await example.getByRole("button", { name: "Crop" }).click()
  await expect
    .poll(async () => (await pixels(example)).center)
    .toBe("34,197,94,255")

  await example.getByLabel("Circle").check()
  await example.getByRole("button", { name: "Crop" }).click()
  await expect.poll(async () => (await pixels(example)).corner).toBe("0,0,0,0")
})
