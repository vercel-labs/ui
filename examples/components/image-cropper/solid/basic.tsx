import { For } from "solid-js"
import {
  ImageCropper,
  ImageCropperGrid,
  ImageCropperHandle,
  ImageCropperImage,
  ImageCropperSelection,
  ImageCropperViewport,
} from "@ui-sdk/solid/image-cropper"

const photo = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420"><rect width="640" height="420" fill="#fde68a"/><circle cx="460" cy="150" r="56" fill="#fff7ed"/><path d="M0 280 120 170l110 100 120-130 130 125 90-60 70 40v175H0z" fill="#a78bfa"/><path d="M0 330l160-80 120 70 150-80 210 85v95H0z" fill="#6d28d9"/><path d="M0 380q160-35 320-10t320-5v55H0z" fill="#2e1065"/></svg>`,
)}`

const corners = ["nw", "ne", "se", "sw"] as const

function Example() {
  return (
    <ImageCropper aria-label="Photo" src={photo}>
      <ImageCropperViewport>
        <ImageCropperImage alt="Mountains at sunset" />
        <ImageCropperSelection>
          <ImageCropperGrid />
          <For each={corners}>{(position) => <ImageCropperHandle position={position} />}</For>
        </ImageCropperSelection>
      </ImageCropperViewport>
    </ImageCropper>
  )
}

export { Example }
