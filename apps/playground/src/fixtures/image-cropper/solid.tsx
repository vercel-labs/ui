import {
  createImageCropperController,
  ImageCropper,
  ImageCropperFlip,
  ImageCropperGrid,
  ImageCropperHandle,
  ImageCropperImage,
  ImageCropperRotate,
  ImageCropperSelection,
  ImageCropperViewport,
  ImageCropperZoom,
} from "@ui-sdk/solid/image-cropper"
import { render } from "@solidjs/web"
import { createSignal, For } from "solid-js"
import { imageCropperOptions } from "tests/fixtures/page.ts"
import {
  describeCrop,
  imageCropperFixture,
} from "tests/fixtures/image-cropper.ts"

const controller = createImageCropperController()

function Fixture() {
  const [action, setAction] = createSignal("")
  const [committed, setCommitted] = createSignal("")
  const { cancel, ...options } = imageCropperOptions()
  return (
    <div class="fixture">
      <button type="button">Before</button>
      <ImageCropper
        aria-label={imageCropperFixture.label}
        src={imageCropperFixture.src}
        controller={controller}
        {...options}
        onCropChange={(crop, details) => {
          if (cancel && details.reason !== "image-load") {
            return details.cancel()
          }
          setAction(`${describeCrop(crop)}:${details.reason}`)
        }}
        onCropCommit={(crop, details) =>
          setCommitted(`${describeCrop(crop)}:${details.reason}`)
        }
      >
        <ImageCropperViewport>
          <ImageCropperImage alt={imageCropperFixture.alt} />
          <ImageCropperSelection>
            <ImageCropperGrid />
            <For each={imageCropperFixture.handles}>
              {(position) => <ImageCropperHandle position={position} />}
            </For>
          </ImageCropperSelection>
        </ImageCropperViewport>
        <ImageCropperZoom />
        <ImageCropperRotate>Rotate</ImageCropperRotate>
        <ImageCropperFlip>Flip</ImageCropperFlip>
      </ImageCropper>
      <button type="button">After</button>
      <button
        type="button"
        onClick={() =>
          controller.setCrop({ x: 0, y: 0, width: 100, height: 100 })
        }
      >
        Use corner
      </button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
      <output aria-label="Committed">{committed()}</output>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
