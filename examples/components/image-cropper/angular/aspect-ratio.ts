import { Component, signal } from "@angular/core"
import {
  ImageCropper,
  ImageCropperFlip,
  ImageCropperGrid,
  ImageCropperHandle,
  ImageCropperImage,
  ImageCropperSelection,
  ImageCropperViewport,
} from "@ui-sdk/angular/image-cropper"

@Component({
  imports: [
    ImageCropper,
    ImageCropperFlip,
    ImageCropperGrid,
    ImageCropperHandle,
    ImageCropperImage,
    ImageCropperSelection,
    ImageCropperViewport,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        @for (ratio of ratios; track ratio.label) {
          <button
            type="button"
            [attr.aria-pressed]="aspectRatio() === ratio.value"
            (click)="aspectRatio.set(ratio.value)"
          >
            {{ ratio.label }}
          </button>
        }
      </div>
      <div
        uiImageCropper
        aria-label="Photo"
        [src]="photo"
        [aspectRatio]="aspectRatio()"
        [minWidth]="64"
        [minHeight]="64"
      >
        <div *uiImageCropperViewport>
          <img uiImageCropperImage alt="Mountains at sunset" />
          <div uiImageCropperSelection>
            <div uiImageCropperGrid></div>
          </div>
          @for (position of handles; track position) {
            <div uiImageCropperHandle [position]="position"></div>
          }
        </div>
        <div data-slot="row">
          <button uiImageCropperFlip>Flip</button>
          <button uiImageCropperFlip direction="vertical">
            Flip Vertically
          </button>
        </div>
      </div>
    </div>
  `,
})
class Example {
  readonly photo = `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420"><rect width="640" height="420" fill="#e5e5e5"/><circle cx="460" cy="150" r="56" fill="#fafafa"/><path d="M0 280 120 170l110 100 120-130 130 125 90-60 70 40v175H0z" fill="#a3a3a3"/><path d="M0 330l160-80 120 70 150-80 210 85v95H0z" fill="#525252"/><path d="M0 380q160-35 320-10t320-5v55H0z" fill="#262626"/></svg>`
  )}`

  readonly ratios = [
    { label: "Free", value: undefined },
    { label: "Square", value: 1 },
    { label: "Wide", value: 16 / 9 },
  ]

  readonly handles = ["nw", "n", "ne", "e", "se", "s", "sw", "w"] as const

  readonly aspectRatio = signal<number | undefined>(undefined)
}

export { Example }
