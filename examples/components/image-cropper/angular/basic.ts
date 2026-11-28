import { Component, DestroyRef, inject, signal } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import { cropImage } from "@ui-sdk/angular/image"
import {
  ImageCropper,
  ImageCropperGrid,
  ImageCropperHandle,
  ImageCropperImage,
  ImageCropperSelection,
  ImageCropperViewport,
  type ImageCrop,
} from "@ui-sdk/angular/image-cropper"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/angular/select"

@Component({
  imports: [
    ImageCropper,
    ImageCropperGrid,
    ImageCropperHandle,
    ImageCropperImage,
    ImageCropperSelection,
    ImageCropperViewport,
    Select,
    SelectContent,
    SelectItem,
    SelectItemIndicator,
    SelectTrigger,
    SelectValue,
    LucideCheck,
    LucideChevronDown,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <ng-container uiSelect [(value)]="ratio">
          <button uiSelectTrigger aria-label="Aspect ratio">
            <span uiSelectValue></span>
            <svg lucideChevronDown></svg>
          </button>
          <div *uiSelectContent>
            @for (item of ratios; track item.value) {
              <div uiSelectItem [value]="item.value">
                {{ item.label }}
                <span *uiSelectItemIndicator>
                  <svg lucideCheck></svg>
                </span>
              </div>
            }
          </div>
        </ng-container>
        <button type="button" data-variant="solid" (click)="save()">
          Crop
        </button>
      </div>
      <div
        uiImageCropper
        [(crop)]="crop"
        aria-label="Photo"
        [src]="photo"
        [aspectRatio]="ratios.find((item) => item.value === ratio())?.ratio"
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
      </div>
      <div data-slot="image-cropper-result">
        @if (result()) {
          <img [src]="result()" alt="Your crop" />
        }
      </div>
    </div>
  `,
})
class Example {
  readonly photo = `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420"><rect width="640" height="420" fill="#e5e5e5"/><circle cx="460" cy="150" r="56" fill="#fafafa"/><path d="M0 280 120 170l110 100 120-130 130 125 90-60 70 40v175H0z" fill="#a3a3a3"/><path d="M0 330l160-80 120 70 150-80 210 85v95H0z" fill="#525252"/><path d="M0 380q160-35 320-10t320-5v55H0z" fill="#262626"/></svg>`
  )}`

  readonly ratios = [
    { value: "free", label: "Free", ratio: undefined },
    { value: "square", label: "Square", ratio: 1 },
    { value: "landscape", label: "4:3", ratio: 4 / 3 },
    { value: "wide", label: "16:9", ratio: 16 / 9 },
  ]

  readonly handles = ["nw", "n", "ne", "e", "se", "s", "sw", "w"] as const

  readonly ratio = signal<string | null>("free")

  readonly crop = signal<ImageCrop | undefined>(undefined)

  readonly result = signal<string | undefined>(undefined)

  async save() {
    const crop = this.crop()
    if (!crop) {
      return
    }
    const file = await cropImage(this.photo, crop)
    const previous = this.result()
    if (previous) {
      URL.revokeObjectURL(previous)
    }
    this.result.set(URL.createObjectURL(file))
  }

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      const url = this.result()
      if (url) {
        URL.revokeObjectURL(url)
      }
    })
  }
}

export { Example }
