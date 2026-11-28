import { Component } from "@angular/core"
import {
  createImageCropperController,
  ImageCropper,
  type ImageCropperCropChange,
  type ImageCropperCropCommit,
  ImageCropperFlip,
  ImageCropperGrid,
  ImageCropperHandle,
  ImageCropperImage,
  ImageCropperRotate,
  ImageCropperSelection,
  ImageCropperViewport,
  ImageCropperZoom,
} from "@ui-sdk/angular/image-cropper"
import {
  describeCrop,
  imageCropperFixture,
} from "../../../../../tests/fixtures/image-cropper"
import { imageCropperOptions } from "../../../../../tests/fixtures/page"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    ImageCropper,
    ImageCropperFlip,
    ImageCropperGrid,
    ImageCropperHandle,
    ImageCropperImage,
    ImageCropperRotate,
    ImageCropperSelection,
    ImageCropperViewport,
    ImageCropperZoom,
  ],
  template: `
    <div class="fixture">
      <button type="button">Before</button>
      <div
        uiImageCropper
        [attr.aria-label]="f.label"
        [src]="f.src"
        [controller]="controller"
        [mode]="options.mode"
        [shape]="options.shape"
        [disabled]="options.disabled"
        [aspectRatio]="options.aspectRatio"
        [defaultCrop]="options.defaultCrop"
        (beforeCropChange)="onCropChange($event)"
        (cropCommit)="onCropCommit($event)"
      >
        <div uiImageCropperViewport>
          <img uiImageCropperImage [attr.alt]="f.alt" />
          <div uiImageCropperSelection>
            <div uiImageCropperGrid></div>
          </div>
          @for (position of f.handles; track position) {
            <div uiImageCropperHandle [position]="position"></div>
          }
        </div>
        <input uiImageCropperZoom />
        <button uiImageCropperRotate>Rotate</button>
        <button uiImageCropperFlip>Flip</button>
      </div>
      <button type="button">After</button>
      <button type="button" (click)="useCorner()">Use corner</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output aria-label="Committed">{{ committed() }}</output>
    </div>
  `,
})
class Fixture {
  readonly f = imageCropperFixture
  readonly controller = createImageCropperController()
  readonly options: ReturnType<typeof imageCropperOptions> & {
    aspectRatio?: number
    defaultCrop?: { x: number; y: number; width: number; height: number }
  } = imageCropperOptions()
  readonly action = state("")
  readonly committed = state("")

  useCorner() {
    this.controller.setCrop({ x: 0, y: 0, width: 100, height: 100 })
  }

  onCropChange(change: ImageCropperCropChange) {
    if (this.options.cancel && change.reason !== "image-load") {
      return change.cancel()
    }
    this.action.set(`${describeCrop(change.value)}:${change.reason}`)
  }

  onCropCommit(commit: ImageCropperCropCommit) {
    this.committed.set(`${describeCrop(commit.value)}:${commit.reason}`)
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
