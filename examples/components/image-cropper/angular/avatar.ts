import { Component, DestroyRef, inject, signal } from "@angular/core"
import { cropImage } from "@ui-sdk/angular/image"
import {
  ImageCropper,
  ImageCropperImage,
  ImageCropperRotate,
  ImageCropperSelection,
  ImageCropperViewport,
  ImageCropperZoom,
  type ImageCrop,
} from "@ui-sdk/angular/image-cropper"

@Component({
  imports: [
    ImageCropper,
    ImageCropperImage,
    ImageCropperRotate,
    ImageCropperSelection,
    ImageCropperViewport,
    ImageCropperZoom,
  ],
  template: `
    <div
      uiImageCropper
      [(crop)]="crop"
      aria-label="Profile photo"
      [src]="photo"
      mode="frame"
      [aspectRatio]="1"
      shape="circle"
      [maxZoom]="4"
    >
      <div *uiImageCropperViewport>
        <img uiImageCropperImage alt="Mountains at sunset" />
        <div uiImageCropperSelection></div>
      </div>
      <div data-slot="row">
        <input uiImageCropperZoom />
        <button uiImageCropperRotate>Rotate</button>
      </div>
      <div data-slot="row">
        <button type="button" (click)="save()">Save Avatar</button>
        @if (avatar()) {
          <img
            data-slot="image-cropper-avatar"
            [src]="avatar()"
            alt="Your new avatar"
          />
        }
      </div>
    </div>
  `,
})
class Example {
  readonly photo = `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420"><rect width="640" height="420" fill="#e5e5e5"/><circle cx="460" cy="150" r="56" fill="#fafafa"/><path d="M0 280 120 170l110 100 120-130 130 125 90-60 70 40v175H0z" fill="#a3a3a3"/><path d="M0 330l160-80 120 70 150-80 210 85v95H0z" fill="#525252"/><path d="M0 380q160-35 320-10t320-5v55H0z" fill="#262626"/></svg>`
  )}`

  readonly crop = signal<ImageCrop | undefined>(undefined)

  readonly avatar = signal<string | undefined>(undefined)

  async save() {
    const crop = this.crop()
    if (!crop) {
      return
    }
    const file = await cropImage(this.photo, crop, {
      width: 128,
      shape: "circle",
    })
    const previous = this.avatar()
    if (previous) {
      URL.revokeObjectURL(previous)
    }
    this.avatar.set(URL.createObjectURL(file))
  }

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      const url = this.avatar()
      if (url) {
        URL.revokeObjectURL(url)
      }
    })
  }
}

export { Example }
