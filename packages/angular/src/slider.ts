import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  inject,
  input,
  output,
  untracked,
  type InputSignal,
} from "@angular/core"
import { slider, type SliderOptions } from "@ui-sdk/core/slider"
import { optionalBoolean, optionalNumber } from "./inputs.ts"
import { emitChange } from "./outputs.ts"
import { useFieldControl } from "./field-context.ts"
import { SliderThumbInput, SliderThumbScope } from "./slider-context.ts"
import { moveAttributes, useText } from "./text.ts"
import { useNativeInput } from "./native-input.ts"
import { usePart, usePrimitive } from "./use-primitive.ts"

/**
 * What `(beforeValueChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type SliderValueChange = Parameters<
  NonNullable<SliderOptions["onValueChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<SliderOptions["onValueChange"]>>[0]
}

/**
 * What `(valueCommit)` emits: the value and what came with it.
 * @experimental
 */
type SliderValueCommit = Parameters<
  NonNullable<SliderOptions["onValueCommit"]>
>[1] & {
  /** The value the interaction ended on. */
  value: Parameters<NonNullable<SliderOptions["onValueCommit"]>>[0]
}

const sliderValue = (value: unknown) =>
  (typeof value === "string" ? Number(value) : value) as SliderOptions["value"]

type SliderField = ReturnType<typeof useFieldControl>

// The field a single thumb's input joins. A range joins it on the root instead.
const thumbFields = new WeakMap<Slider, () => SliderField>()

/**
 * The root: a group around the thumbs, and the hidden input the form submits.
 * @experimental
 */
@Directive({ selector: "[uiSlider]", exportAs: "uiSlider" })
class Slider {
  readonly #field = useFieldControl()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** The value: a number for one thumb, or an array with one number per thumb, like `[20, 80]` for a range. Bind it with `[(value)]` to control the slider. */
  readonly value = input(undefined, { transform: sliderValue })
  /** The value at first, when uncontrolled. A form reset returns to it. */
  readonly defaultValue = input(undefined, { transform: sliderValue })
  /** The new value, after a change that wasn't canceled. */
  readonly valueChange = output<SliderValueChange["value"]>()
  /** Runs while the value changes: on every step of a drag or a key. `$event.thumb` says which thumb moved, and `$event.cancel()` stops it. */
  readonly beforeValueChange = output<SliderValueChange>()
  /** Runs once an interaction that changed the value ends: the pointer lifts, the key comes up, or a screen reader adjusts it. For saving. */
  readonly valueCommit = output<SliderValueCommit>()
  /** The lowest value. */
  readonly min = input(undefined, { transform: optionalNumber })
  /** The highest value. When the steps from `min` don't land on it, the highest step below it is the end. */
  readonly max = input(undefined, { transform: optionalNumber })
  /** How far one step moves, from `min`. */
  readonly step = input(undefined, { transform: optionalNumber })
  /** How far Page Up, Page Down and Shift with an arrow key move. */
  readonly largeStep = input(undefined, { transform: optionalNumber })
  /** How many steps apart neighbouring thumbs stay. Thumbs never pass each other. */
  readonly minStepsBetweenThumbs = input(undefined, {
    transform: optionalNumber,
  })
  /** The slider's axis. Vertical sliders grow upward. */
  readonly orientation: InputSignal<SliderOptions["orientation"]> = input()
  /** Disables it like a native control: thumbs can't be focused or moved, and nothing is submitted. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Keeps it focusable and submitted, but stops drags, keys and screen reader adjustments from changing it. */
  readonly readOnly = input(undefined, { transform: optionalBoolean })
  /** Marks it required, with `data-required`. A slider always has a value, so it never blocks a form. */
  readonly required = input(undefined, { transform: optionalBoolean })
  /** The name it submits under: the number, or a range as `"start/end"`. Without one, it submits nothing. */
  readonly name: InputSignal<SliderOptions["name"]> = input()
  /** The id of a form to belong to, when it isn't inside that form. */
  readonly form: InputSignal<SliderOptions["form"]> = input()
  /** How values read, for screen readers and `SliderValue`: `Intl.NumberFormat` options, like `{ style: "currency", currency: "EUR" }`, or a function of the value. */
  readonly format: InputSignal<SliderOptions["format"]> = input()
  /** The locale values are formatted in. Defaults to the page's `lang`, or the browser's language without one, once the page is interactive. Server markup uses English until then, so it never disagrees with the client. */
  readonly locale: InputSignal<SliderOptions["locale"]> = input()
  /** Moves the slider from anywhere. Create one with `createSliderController()`. */
  readonly controller: InputSignal<SliderOptions["controller"]> = input()

  readonly handle = usePrimitive(slider, () => ({
    debug: this.debug(),
    value: this.value(),
    defaultValue: this.defaultValue(),
    onValueChange: emitChange(this.beforeValueChange, this.valueChange),
    onValueCommit: (value, details) =>
      this.valueCommit.emit({ ...details, value }),
    min: this.min(),
    max: this.max(),
    step: this.step(),
    largeStep: this.largeStep(),
    minStepsBetweenThumbs: this.minStepsBetweenThumbs(),
    orientation: this.orientation(),
    disabled: this.disabled() || this.#field?.disabled(),
    readOnly: this.readOnly(),
    required: this.required(),
    name: this.name() ?? this.#field?.name(),
    form: this.form(),
    format: this.format(),
    locale: this.locale(),
    controller: this.controller(),
    thumbInputId: this.#field?.controlId(),
  }))
  // A range is a group the field's label names. A single thumb is the control
  // itself. Decided once, from the shape the slider starts with.
  readonly #range = computed(() => {
    const shape = untracked(() => this.value() ?? this.defaultValue())
    return Array.isArray(shape) && shape.length > 1
  })
  /** The slider's state, as a signal. */
  readonly state = usePart(this.handle, "root", undefined, {
    joined: this.#field && {
      part: () => (this.#range() ? this.#field?.joined.part() : undefined),
      // The field's control id is the first thumb's, so the group keeps its own.
      merge: (own, control) => ({
        ...this.#field?.joined.merge(own, control),
        id: own["id"],
      }),
    },
  }).state

  constructor() {
    thumbFields.set(this, () => (this.#range() ? undefined : this.#field))
    useNativeInput(this.handle, "input")
  }
}

/**
 * Where presses land. A press on the track moves the nearest thumb there.
 * @experimental
 */
@Directive({ selector: "[uiSliderControl]", exportAs: "uiSliderControl" })
class SliderControl {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(Slider).handle, "control").state
}

/**
 * The rail the thumbs move along. Positions are percentages of it.
 * @experimental
 */
@Directive({ selector: "[uiSliderTrack]", exportAs: "uiSliderTrack" })
class SliderTrack {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(Slider).handle, "track").state
}

/**
 * The filled part of the track: up to a single thumb, or between a range's thumbs.
 * @experimental
 */
@Directive({ selector: "[uiSliderIndicator]", exportAs: "uiSliderIndicator" })
class SliderIndicator {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(Slider).handle, "indicator").state
}

/**
 * A thumb, with the native range input that takes focus inside it. Its
 * `aria-label`, `aria-labelledby` and `aria-describedby` go to that input.
 * @experimental
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "[uiSliderThumb]",
  exportAs: "uiSliderThumb",
  imports: [SliderThumbInput],
  providers: [
    {
      provide: SliderThumbScope,
      useFactory: () => {
        const slider = inject(Slider)
        const thumb = inject(SliderThumb)
        return {
          handle: slider.handle,
          key: thumb.key,
          named: thumb.named,
          inField: () => !!thumbFields.get(slider)?.(),
        }
      },
    },
  ],
  template: `<ng-content /><input uiSliderThumbInput />`,
})
class SliderThumb {
  /** Which value the thumb shows, from 0. Give each thumb of a range its own. */
  readonly index = input(undefined, { transform: optionalNumber })

  /** Names the thumb's input. Bind it with `[aria-label]`. */
  readonly ariaLabel = input<string>(undefined, { alias: "aria-label" })
  /** The id of the element that names the thumb's input. Bind it with `[aria-labelledby]`. */
  readonly ariaLabelledby = input<string>(undefined, {
    alias: "aria-labelledby",
  })
  /** The id of the element that describes the thumb's input. Bind it with `[aria-describedby]`. */
  readonly ariaDescribedby = input<string>(undefined, {
    alias: "aria-describedby",
  })

  /** The names the author gave the thumb, which its input takes. */
  readonly named = computed(() => ({
    "aria-label": this.ariaLabel(),
    "aria-labelledby": this.ariaLabelledby(),
    "aria-describedby": this.ariaDescribedby(),
  }))
  /** The props the thumb and its input share. */
  readonly key = computed(() => {
    const index = this.index() ?? 0
    return { index, id: String(index) }
  })
  /** The thumb's state, as a signal. */
  readonly state = usePart(inject(Slider).handle, "thumb", this.key).state

  constructor() {
    moveAttributes(["aria-label", "aria-labelledby", "aria-describedby"])
  }
}

/**
 * The formatted value, a range joined with an en dash. Content replaces it.
 * @experimental
 */
@Directive({ selector: "[uiSliderValue]", exportAs: "uiSliderValue" })
class SliderValue {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(Slider).handle, "value").state

  constructor() {
    useText(() => this.state().text)
  }
}

export { createSliderController } from "@ui-sdk/core/slider"
export type {
  NumberFormat,
  SliderApi,
  SliderChangeOptions,
  SliderController,
  SliderOptions,
  SliderPrimitive,
  SliderState,
  SliderThumbProps,
  SliderThumbState,
  SliderValueChangeDetails,
  SliderValueChangeReason,
  SliderValueCommitDetails,
  SliderValueState,
} from "@ui-sdk/core/slider"

export {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
  SliderValue,
  type SliderValueChange,
  type SliderValueCommit,
}
