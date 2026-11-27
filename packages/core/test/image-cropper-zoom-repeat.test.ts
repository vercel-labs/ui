// @vitest-environment jsdom
import { expect, test, vi } from "vitest"
import { imageCropper } from "../src/components/image-cropper/image-cropper"

test("the zoom input read back at the precision it keeps changes no crop", () => {
  const onCropChange = vi.fn()
  const onCropCommit = vi.fn()
  const cropper = imageCropper({
    id: "c",
    src: "photo.png",
    mode: "frame",
    aspectRatio: 2,
    maxZoom: 5,
    onCropChange,
    onCropCommit,
  })
  cropper.api.internal.loaded({
    naturalWidth: 1280,
    naturalHeight: 840,
  } as HTMLImageElement)
  const input = document.createElement("input")
  input.type = "range"
  input.min = "1"
  input.max = "5"
  input.step = "any"
  let repeated = 0
  for (let step = 0; step < 40; step++) {
    input.value = String(cropper.api.getZoom() + 0.1)
    cropper.api.internal.zoomInput(new Event("input"), input)
    cropper.api.internal.zoomCommit(new Event("change"))
    const changes = onCropChange.mock.calls.length
    // Chrome and WebKit keep 15 significant digits of a range input's value.
    input.value = String(Number(input.valueAsNumber.toPrecision(15)))
    cropper.api.internal.zoomInput(new Event("input"), input)
    repeated += onCropChange.mock.calls.length - changes
  }
  expect(repeated).toBe(0)
  expect(onCropCommit.mock.lastCall![0]).toEqual(cropper.api.getCrop())
})
