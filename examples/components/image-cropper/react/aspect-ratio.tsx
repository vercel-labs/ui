"use client"

import * as React from "react"
import {
  ImageCropper,
  ImageCropperFlip,
  ImageCropperGrid,
  ImageCropperHandle,
  ImageCropperImage,
  ImageCropperSelection,
  ImageCropperViewport,
} from "@ui-sdk/react/image-cropper"

const photo = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420"><rect width="640" height="420" fill="#fde68a"/><circle cx="460" cy="150" r="56" fill="#fff7ed"/><path d="M0 280 120 170l110 100 120-130 130 125 90-60 70 40v175H0z" fill="#a78bfa"/><path d="M0 330l160-80 120 70 150-80 210 85v95H0z" fill="#6d28d9"/><path d="M0 380q160-35 320-10t320-5v55H0z" fill="#2e1065"/></svg>`,
)}`

const ratios = [
  { label: "Free", value: undefined },
  { label: "Square", value: 1 },
  { label: "Wide", value: 16 / 9 },
]

const handles = ["nw", "n", "ne", "e", "se", "s", "sw", "w"] as const

function Example() {
  const [aspectRatio, setAspectRatio] = React.useState<number>()
  return (
    <div data-slot="stack">
      <div data-slot="controls">
        {ratios.map((ratio) => (
          <button
            key={ratio.label}
            type="button"
            aria-pressed={aspectRatio === ratio.value}
            onClick={() => setAspectRatio(ratio.value)}
          >
            {ratio.label}
          </button>
        ))}
      </div>
      <ImageCropper aria-label="Photo" src={photo} aspectRatio={aspectRatio} minWidth={64} minHeight={64}>
        <ImageCropperViewport>
          <ImageCropperImage alt="Mountains at sunset" />
          <ImageCropperSelection>
            <ImageCropperGrid />
            {handles.map((position) => (
              <ImageCropperHandle key={position} position={position} />
            ))}
          </ImageCropperSelection>
        </ImageCropperViewport>
        <div data-slot="row">
          <ImageCropperFlip>Flip</ImageCropperFlip>
          <ImageCropperFlip direction="vertical">Flip Vertically</ImageCropperFlip>
        </div>
      </ImageCropper>
    </div>
  )
}

export { Example }
