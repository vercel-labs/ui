import {
  Directive,
  inject,
  input,
  output,
  type InputSignal,
} from "@angular/core"
import {
  imageCropper,
  type ImageCropperFlipProps,
  type ImageCropperHandleProps,
  type ImageCropperOptions,
} from "@ui-sdk/core/image-cropper"
import { optionalBoolean, optionalNumber } from "./inputs.ts"
import { emitChange } from "./outputs.ts"
import { useId, usePart, usePrimitive } from "./use-primitive.ts"

/**
 * What `(beforeCropChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type ImageCropperCropChange = Parameters<
  NonNullable<ImageCropperOptions["onCropChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<ImageCropperOptions["onCropChange"]>>[0]
}

/**
 * What `(cropCommit)` emits: the value and what came with it.
 * @experimental
 */
type ImageCropperCropCommit = Parameters<
  NonNullable<ImageCropperOptions["onCropCommit"]>
>[1] & {
  /** The value it reports. */
  value: Parameters<NonNullable<ImageCropperOptions["onCropCommit"]>>[0]
}

/**
 * The root: a group around the image and its controls, busy until the image loads. `[(crop)]` controls it.
 * @experimental
 */
@Directive({ selector: "[uiImageCropper]", exportAs: "uiImageCropper" })
class ImageCropper {
  /** Logs every crop change with its reason. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** The image's URL, like an object URL for a file someone picked. */
  readonly src: InputSignal<ImageCropperOptions["src"]> = input()
  /** The crop, in the image's own pixels, with its `rotation`, `flipX` and `flipY`. Bind it with `[(crop)]` to control the cropper. */
  readonly crop: InputSignal<ImageCropperOptions["crop"]> = input()
  /** The crop at first, when uncontrolled. Without one, a crop at `aspectRatio` in the middle: four fifths of the largest in a box, the largest in a frame. */
  readonly defaultCrop: InputSignal<ImageCropperOptions["defaultCrop"]> =
    input()
  /** The new value, after a change that wasn't canceled. */
  readonly cropChange = output<ImageCropperCropChange["value"]>()
  /** Runs while the crop changes: on every step of a drag, a key or the wheel. `$event.cancel()` keeps the crop. */
  readonly beforeCropChange = output<ImageCropperCropChange>()
  /** Runs once an interaction that changed the crop ends. For saving. */
  readonly cropCommit = output<ImageCropperCropCommit>()
  /** `"box"` moves and resizes a selection over the image; `"frame"` pans and zooms the image under a still one. */
  readonly mode: InputSignal<ImageCropperOptions["mode"]> = input()
  /** Keeps the crop's width over its height, like `1` for a square. */
  readonly aspectRatio = input(undefined, { transform: optionalNumber })
  /** The selection's shape, as `data-shape`. Pass the same shape to `cropImage`. */
  readonly shape: InputSignal<ImageCropperOptions["shape"]> = input()
  /** The narrowest the crop gets, in image pixels. */
  readonly minWidth = input(undefined, { transform: optionalNumber })
  /** The shortest the crop gets, in image pixels. */
  readonly minHeight = input(undefined, { transform: optionalNumber })
  /** How far the crop magnifies the image, where 1 is the largest crop. */
  readonly maxZoom = input(undefined, { transform: optionalNumber })
  /** Stops every change. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Sets the crop from anywhere. Create one with `createImageCropperController()`. */
  readonly controller: InputSignal<ImageCropperOptions["controller"]> = input()

  readonly handle = usePrimitive(imageCropper, () => ({
    debug: this.debug(),
    src: this.src(),
    crop: this.crop(),
    defaultCrop: this.defaultCrop(),
    onCropChange: emitChange(this.beforeCropChange, this.cropChange),
    onCropCommit: (value, details) =>
      this.cropCommit.emit({ ...details, value }),
    mode: this.mode(),
    aspectRatio: this.aspectRatio(),
    shape: this.shape(),
    minWidth: this.minWidth(),
    minHeight: this.minHeight(),
    maxZoom: this.maxZoom(),
    disabled: this.disabled(),
    controller: this.controller(),
  }))
  /** The image cropper's state, as a signal. */
  readonly state = usePart(this.handle, "root").state
}

/**
 * The area the image shows in. Give it a size; its padding keeps the image off its edges. In a frame, a pointer pans the image and the wheel zooms it.
 * @experimental
 */
@Directive({
  selector: "[uiImageCropperViewport]",
  exportAs: "uiImageCropperViewport",
})
class ImageCropperViewport {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(ImageCropper).handle, "viewport").state
}

/**
 * The image, from the root's `src`, turned and flipped. Give it an `alt`.
 * @experimental
 */
@Directive({
  selector: "[uiImageCropperImage]",
  exportAs: "uiImageCropperImage",
})
class ImageCropperImage {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(ImageCropper).handle, "image").state
}

/**
 * The crop. A pointer drags it in a box; arrows move it, plus and minus zoom, and R turns the image.
 * @experimental
 */
@Directive({
  selector: "[uiImageCropperSelection]",
  exportAs: "uiImageCropperSelection",
})
class ImageCropperSelection {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(ImageCropper).handle, "selection").state
}

/**
 * Lines across the selection in thirds, for CSS to draw, with `data-dragging` during a drag.
 * @experimental
 */
@Directive({ selector: "[uiImageCropperGrid]", exportAs: "uiImageCropperGrid" })
class ImageCropperGrid {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(ImageCropper).handle, "grid").state
}

/**
 * An edge or corner of the selection, by its `position`, that resizes it in a box.
 * @experimental
 */
@Directive({
  selector: "[uiImageCropperHandle]",
  exportAs: "uiImageCropperHandle",
})
class ImageCropperHandle {
  /** The edge or corner it resizes, like `"nw"` for the top left corner. */
  readonly position = input.required<ImageCropperHandleProps["position"]>()

  readonly #id = useId()
  /** The part's state, as a signal. */
  readonly state = usePart(inject(ImageCropper).handle, "handle", () => ({
    id: this.#id,
    position: this.position(),
  })).state
}

/**
 * A range input for the zoom, from 1 to `maxZoom`.
 * @experimental
 */
@Directive({ selector: "[uiImageCropperZoom]", exportAs: "uiImageCropperZoom" })
class ImageCropperZoom {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(ImageCropper).handle, "zoom").state
}

/**
 * A button that turns the image a quarter clockwise.
 * @experimental
 */
@Directive({
  selector: "[uiImageCropperRotate]",
  exportAs: "uiImageCropperRotate",
})
class ImageCropperRotate {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(ImageCropper).handle, "rotate").state
}

/**
 * A button that mirrors the image, left to right or, with `direction="vertical"`, top to bottom.
 * @experimental
 */
@Directive({ selector: "[uiImageCropperFlip]", exportAs: "uiImageCropperFlip" })
class ImageCropperFlip {
  /** Which way it mirrors the image. */
  readonly direction: InputSignal<ImageCropperFlipProps["direction"]> = input()

  readonly #id = useId()
  /** The part's state, as a signal. */
  readonly state = usePart(inject(ImageCropper).handle, "flip", () => ({
    id: this.#id,
    direction: this.direction(),
  })).state
}

export { createImageCropperController } from "@ui-sdk/core/image-cropper"
export type {
  ImageCrop,
  ImageCropperApi,
  ImageCropperChangeOptions,
  ImageCropperController,
  ImageCropperCropChangeDetails,
  ImageCropperCropChangeReason,
  ImageCropperCropCommitDetails,
  ImageCropperFlipDirection,
  ImageCropperFlipProps,
  ImageCropperHandlePosition,
  ImageCropperHandleProps,
  ImageCropperHandleState,
  ImageCropperMode,
  ImageCropperOptions,
  ImageCropperPrimitive,
  ImageCropperShape,
  ImageCropperState,
  ImageRotation,
} from "@ui-sdk/core/image-cropper"

export {
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
}
