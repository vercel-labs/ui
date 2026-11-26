// @vitest-environment jsdom
import { beforeAll, expect, test } from "vitest"
import { defineImageCropperElements } from "../src/image-cropper"

const wait = (ms = 10) => new Promise((resolve) => setTimeout(resolve, ms))

beforeAll(() => {
  ;(
    Element.prototype as { getAnimations?: () => Animation[] }
  ).getAnimations ??= () => []
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver
  defineImageCropperElements()
})

test("a default crop set on a cropper already in the page starts the crop", async () => {
  document.body.innerHTML = `
    <ui-image-cropper aria-label="Photo" src="photo.png">
      <ui-image-cropper-viewport>
        <ui-image-cropper-image><img alt="Photo" /></ui-image-cropper-image>
        <ui-image-cropper-selection></ui-image-cropper-selection>
      </ui-image-cropper-viewport>
    </ui-image-cropper>`
  const cropper = document.querySelector("ui-image-cropper")!
  cropper.defaultCrop = { x: 40, y: 40, width: 320, height: 240 }
  await wait()
  const img = cropper.querySelector("img")!
  Object.defineProperties(img, {
    naturalWidth: { value: 640 },
    naturalHeight: { value: 420 },
  })
  img.dispatchEvent(new Event("load"))
  await wait()
  expect(cropper.crop).toMatchObject({ x: 40, y: 40, width: 320, height: 240 })
})
