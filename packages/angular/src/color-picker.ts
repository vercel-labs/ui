import {
  Directive,
  inject,
  input,
  output,
  type InputSignal,
} from "@angular/core"
import {
  colorPicker,
  type ColorPickerAreaProps,
  type ColorPickerChannelInputProps,
  type ColorPickerOptions,
  type ColorPickerSliderProps,
  type ColorPickerSwatchItemProps,
} from "@ui-sdk/core/color-picker"
import { optionalBoolean } from "./inputs.ts"
import { emitChange } from "./outputs.ts"
import { useFieldControl } from "./field-context.ts"
import { useNativeInput } from "./native-input.ts"
import { useId, usePart, usePrimitive } from "./use-primitive.ts"

/**
 * What `(beforeValueChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type ColorPickerValueChange = Parameters<
  NonNullable<ColorPickerOptions["onValueChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<ColorPickerOptions["onValueChange"]>>[0]
}

/**
 * What `(valueCommit)` emits: the value and what came with it.
 * @experimental
 */
type ColorPickerValueCommit = Parameters<
  NonNullable<ColorPickerOptions["onValueCommit"]>
>[1] & {
  /** The value it reports. */
  value: Parameters<NonNullable<ColorPickerOptions["onValueCommit"]>>[0]
}

/**
 * The root: a group around the picker's parts, and the hidden input the form submits.
 * @experimental
 */
@Directive({ selector: "[uiColorPicker]", exportAs: "uiColorPicker" })
class ColorPicker {
  readonly #field = useFieldControl()
  /** Logs every state change with its reason. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** The value, as a CSS color. Bind it with `[(value)]` to control it. */
  readonly value: InputSignal<ColorPickerOptions["value"]> = input()
  /** The value at first, when uncontrolled. A form reset returns to it. */
  readonly defaultValue: InputSignal<ColorPickerOptions["defaultValue"]> =
    input()
  /** The new value, after a change that wasn't canceled. */
  readonly valueChange = output<ColorPickerValueChange["value"]>()
  /** Runs while the value changes. `$event.cancel()` stops it. */
  readonly beforeValueChange = output<ColorPickerValueChange>()
  /** Runs once an interaction that changed the value ends. For saving. */
  readonly valueCommit = output<ColorPickerValueCommit>()
  /** The space the parts edit in, which decides their channels. */
  readonly space: InputSignal<ColorPickerOptions["space"]> = input()
  /** How the value is written: `"hex"`, or a space in its CSS syntax. */
  readonly format: InputSignal<ColorPickerOptions["format"]> = input()
  /** The colors the value can hold: `"srgb"`, `"p3"`, or `false` for any. */
  readonly gamut: InputSignal<ColorPickerOptions["gamut"]> = input()
  /** Disables every part: they can't be focused or changed, and the value isn't submitted. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Keeps the parts focusable and the value submitted, but stops changes. */
  readonly readOnly = input(undefined, { transform: optionalBoolean })
  /** Marks it required, with `data-required`. */
  readonly required = input(undefined, { transform: optionalBoolean })
  /** The name the value submits under. */
  readonly name: InputSignal<ColorPickerOptions["name"]> = input()
  /** The id of a form to belong to, when it isn't inside that form. */
  readonly form: InputSignal<ColorPickerOptions["form"]> = input()
  /** Sets the value from anywhere. Create one with `createColorPickerController()`. */
  readonly controller: InputSignal<ColorPickerOptions["controller"]> = input()

  readonly handle = usePrimitive(colorPicker, () => ({
    debug: this.debug(),
    value: this.value(),
    defaultValue: this.defaultValue(),
    onValueChange: emitChange(this.beforeValueChange, this.valueChange),
    onValueCommit: (value, details) =>
      this.valueCommit.emit({ ...details, value }),
    space: this.space(),
    format: this.format(),
    gamut: this.gamut(),
    disabled: this.disabled() || this.#field?.disabled(),
    readOnly: this.readOnly(),
    required: this.required(),
    name: this.name() ?? this.#field?.name(),
    form: this.form(),
    controller: this.controller(),
  }))
  /** The color picker's state, as a signal. */
  readonly state = usePart(this.handle, "root", undefined, {
    joined: this.#field?.joined,
  }).state

  constructor() {
    useNativeInput(this.handle, "hidden-input")
  }
}

/**
 * A surface for two channels, `x` and `y`. Its background comes from `--color-area-background` where gradients draw it, or a `ColorPickerAreaCanvas`.
 * @experimental
 */
@Directive({ selector: "[uiColorPickerArea]", exportAs: "uiColorPickerArea" })
class ColorPickerArea {
  /** The channel across, left to right. */
  readonly x: InputSignal<ColorPickerAreaProps["x"]> = input()
  /** The channel up, bottom to top. */
  readonly y: InputSignal<ColorPickerAreaProps["y"]> = input()

  /** The part's state, as a signal. */
  readonly state = usePart(inject(ColorPicker).handle, "area", () => ({
    x: this.x(),
    y: this.y(),
  })).state
}

/**
 * The area's thumb: a slider screen readers hear as both channels.
 * @experimental
 */
@Directive({
  selector: "[uiColorPickerAreaThumb]",
  exportAs: "uiColorPickerAreaThumb",
})
class ColorPickerAreaThumb {
  /** The channel across, left to right. Inside an area, the area's. */
  readonly x: InputSignal<ColorPickerAreaProps["x"]> = input()
  /** The channel up, bottom to top. Inside an area, the area's. */
  readonly y: InputSignal<ColorPickerAreaProps["y"]> = input()

  readonly #area = inject(ColorPickerArea, { optional: true })
  /** The thumb's state, as a signal. */
  readonly state = usePart(inject(ColorPicker).handle, "area-thumb", () => ({
    x: this.x() ?? this.#area?.x(),
    y: this.y() ?? this.#area?.y(),
  })).state
}

/**
 * Paints the area pixel by pixel, for channels no gradient draws, like OKLCH's chroma by lightness. Colors outside the gamut stay transparent.
 * @experimental
 */
@Directive({
  selector: "[uiColorPickerAreaCanvas]",
  exportAs: "uiColorPickerAreaCanvas",
})
class ColorPickerAreaCanvas {
  /** The channel across, left to right. Inside an area, the area's. */
  readonly x: InputSignal<ColorPickerAreaProps["x"]> = input()
  /** The channel up, bottom to top. Inside an area, the area's. */
  readonly y: InputSignal<ColorPickerAreaProps["y"]> = input()

  readonly #area = inject(ColorPickerArea, { optional: true })

  constructor() {
    usePart(inject(ColorPicker).handle, "area-canvas", () => ({
      x: this.x() ?? this.#area?.x(),
      y: this.y() ?? this.#area?.y(),
    }))
  }
}

/**
 * A track for one `channel`, drawn by `--color-slider-background`.
 * @experimental
 */
@Directive({
  selector: "[uiColorPickerSlider]",
  exportAs: "uiColorPickerSlider",
})
class ColorPickerSlider {
  /** The channel the slider edits, like `"hue"` or `"alpha"`. */
  readonly channel: InputSignal<ColorPickerSliderProps["channel"]> = input()
  /** The slider's axis. Vertical sliders grow upward. */
  readonly orientation: InputSignal<ColorPickerSliderProps["orientation"]> =
    input()

  /** The id its thumb shares. */
  readonly id = useId()
  /** The slider's state, as a signal. */
  readonly state = usePart(inject(ColorPicker).handle, "slider", () => ({
    id: this.id,
    channel: this.channel(),
    orientation: this.orientation(),
  })).state
}

/**
 * The slider's thumb, at `--color-slider-thumb-position`.
 * @experimental
 */
@Directive({
  selector: "[uiColorPickerSliderThumb]",
  exportAs: "uiColorPickerSliderThumb",
})
class ColorPickerSliderThumb {
  /** The channel the thumb edits. Inside a slider, the slider's. */
  readonly channel: InputSignal<ColorPickerSliderProps["channel"]> = input()
  /** The thumb's axis. Inside a slider, the slider's. */
  readonly orientation: InputSignal<ColorPickerSliderProps["orientation"]> =
    input()

  readonly #slider = inject(ColorPickerSlider, { optional: true })
  /** The thumb's state, as a signal. */
  readonly state = usePart(inject(ColorPicker).handle, "slider-thumb", () => ({
    id: this.#slider?.id,
    channel: this.channel() ?? this.#slider?.channel(),
    orientation: this.orientation() ?? this.#slider?.orientation(),
  })).state
}

/**
 * A text input that reads any CSS color on Enter or blur. Text that isn't one goes back to the value. The core writes its text.
 * @experimental
 */
@Directive({ selector: "[uiColorPickerInput]", exportAs: "uiColorPickerInput" })
class ColorPickerInput {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(ColorPicker).handle, "input").state
}

/**
 * A number input for one `channel`, in the units people read it in.
 * @experimental
 */
@Directive({
  selector: "[uiColorPickerChannelInput]",
  exportAs: "uiColorPickerChannelInput",
})
class ColorPickerChannelInput {
  /** The channel the input edits, like `"hue"` or `"alpha"`. */
  readonly channel: InputSignal<ColorPickerChannelInputProps["channel"]> =
    input()

  readonly #id = useId()
  /** The input's state, as a signal. */
  readonly state = usePart(inject(ColorPicker).handle, "channel-input", () => ({
    id: this.#id,
    channel: this.channel(),
  })).state
}

/**
 * The color itself, as `--color-picker-color`, named for screen readers.
 * @experimental
 */
@Directive({
  selector: "[uiColorPickerSwatch]",
  exportAs: "uiColorPickerSwatch",
})
class ColorPickerSwatch {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(ColorPicker).handle, "swatch").state
}

/**
 * A button that picks a color from the screen, where the browser can. Elsewhere it's disabled, with `data-unsupported`.
 * @experimental
 */
@Directive({
  selector: "[uiColorPickerEyeDropper]",
  exportAs: "uiColorPickerEyeDropper",
})
class ColorPickerEyeDropper {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(ColorPicker).handle, "eye-dropper").state
}

/**
 * A list of preset colors. Arrow keys move between them.
 * @experimental
 */
@Directive({
  selector: "[uiColorPickerSwatches]",
  exportAs: "uiColorPickerSwatches",
})
class ColorPickerSwatches {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(ColorPicker).handle, "swatches").state
}

/**
 * A preset color, as `--color-picker-color`. Pressing it sets the value.
 * @experimental
 */
@Directive({
  selector: "[uiColorPickerSwatchItem]",
  exportAs: "uiColorPickerSwatchItem",
})
class ColorPickerSwatchItem {
  /** The color it picks, as any CSS color. */
  readonly value = input.required<ColorPickerSwatchItemProps["value"]>()

  /** The part's state, as a signal. */
  readonly state = usePart(inject(ColorPicker).handle, "swatch-item", () => ({
    value: this.value(),
  })).state
}

export { createColorPickerController } from "@ui-sdk/core/color-picker"
export type {
  Color,
  ColorChannel,
  ColorFormat,
  ColorGamut,
  ColorPickerApi,
  ColorPickerAreaProps,
  ColorPickerChangeOptions,
  ColorPickerChannelInputProps,
  ColorPickerController,
  ColorPickerOptions,
  ColorPickerPrimitive,
  ColorPickerSliderProps,
  ColorPickerSliderState,
  ColorPickerSpace,
  ColorPickerState,
  ColorPickerSwatchItemProps,
  ColorPickerSwatchItemState,
  ColorPickerValueChangeDetails,
  ColorPickerValueChangeReason,
  ColorPickerValueCommitDetails,
} from "@ui-sdk/core/color-picker"

export {
  ColorPicker,
  ColorPickerArea,
  ColorPickerAreaCanvas,
  ColorPickerAreaThumb,
  ColorPickerChannelInput,
  ColorPickerEyeDropper,
  ColorPickerInput,
  ColorPickerSlider,
  ColorPickerSliderThumb,
  ColorPickerSwatch,
  ColorPickerSwatches,
  ColorPickerSwatchItem,
  type ColorPickerValueChange,
  type ColorPickerValueCommit,
}
