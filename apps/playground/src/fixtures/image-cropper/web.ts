import { imageCropperOptions } from "tests/fixtures/page.ts"
import {
  describeCrop,
  imageCropperFixture,
} from "tests/fixtures/image-cropper.ts"

const markup = () => `
  <div class="fixture">
    <button type="button">Before</button>
    <ui-image-cropper aria-label="${imageCropperFixture.label}">
      <ui-image-cropper-viewport>
        <ui-image-cropper-image><img alt="${imageCropperFixture.alt}" /></ui-image-cropper-image>
        <ui-image-cropper-selection>
          <ui-image-cropper-grid></ui-image-cropper-grid>
          ${imageCropperFixture.handles.map((position) => `<ui-image-cropper-handle position="${position}"></ui-image-cropper-handle>`).join("")}
        </ui-image-cropper-selection>
      </ui-image-cropper-viewport>
      <ui-image-cropper-zoom></ui-image-cropper-zoom>
      <ui-image-cropper-rotate>Rotate</ui-image-cropper-rotate>
      <ui-image-cropper-flip>Flip</ui-image-cropper-flip>
    </ui-image-cropper>
    <button type="button">After</button>
    <button type="button" id="controller">Use corner</button>
    <output role="status" aria-label="Last action"></output>
    <output aria-label="Committed"></output>
  </div>
`

type Crop = Parameters<typeof describeCrop>[0]

async function mount(root: HTMLElement) {
  const { cancel, mode, shape, disabled, aspectRatio, defaultCrop } =
    imageCropperOptions()
  root.innerHTML = markup()
  const cropper = root.querySelector<
    HTMLElement & {
      defaultCrop?: object
      api?: { setCrop: (crop: object) => void }
    }
  >("ui-image-cropper")!
  cropper.setAttribute("src", imageCropperFixture.src)
  cropper.setAttribute("mode", mode)
  cropper.setAttribute("shape", shape)
  if (disabled) {
    cropper.setAttribute("disabled", "")
  }
  if (aspectRatio) {
    cropper.setAttribute("aspect-ratio", String(aspectRatio))
  }
  if (defaultCrop) {
    cropper.defaultCrop = defaultCrop
  }
  const [action, committed] = root.querySelectorAll("output")
  root.addEventListener(
    "cropchange",
    (event) => {
      const detail = (event as CustomEvent<{ value: Crop; reason: string }>)
        .detail
      if (cancel && detail.reason !== "image-load") {
        return event.preventDefault()
      }
      action!.textContent = `${describeCrop(detail.value)}:${detail.reason}`
    },
    { capture: true }
  )
  root.addEventListener(
    "cropcommit",
    (event) => {
      const detail = (event as CustomEvent<{ value: Crop; reason: string }>)
        .detail
      committed!.textContent = `${describeCrop(detail.value)}:${detail.reason}`
    },
    { capture: true }
  )
  await import("@ui-sdk/web/image-cropper")
  root
    .querySelector("#controller")!
    .addEventListener("click", () =>
      cropper.api?.setCrop({ x: 0, y: 0, width: 100, height: 100 })
    )
}

export { mount }
