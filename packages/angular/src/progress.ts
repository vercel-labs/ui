import { Directive, inject, input, type InputSignal } from "@angular/core"
import { progress, type ProgressOptions } from "@ui-sdk/core/progress"
import { nullableNumber, optionalBoolean, optionalNumber } from "./inputs.ts"
import { useText } from "./text.ts"
import { usePart, usePrimitive } from "./use-primitive.ts"

/**
 * The root, which is the progressbar.
 * @experimental
 */
@Directive({ selector: "[uiProgress]", exportAs: "uiProgress" })
class Progress {
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** The lowest value. */
  readonly min = input(undefined, { transform: optionalNumber })
  /** The highest value. */
  readonly max = input(undefined, { transform: optionalNumber })
  /** How the value reads, for screen readers and the Value part: `Intl.NumberFormat` options, or a function of the value. A percent style shows where the value sits between `min` and `max`; any other style shows the value itself, like `{ style: "unit", unit: "gigabyte" }`. */
  readonly format: InputSignal<ProgressOptions["format"]> = input()
  /** The locale the value is formatted in. Defaults to the page's `lang`, or the browser's language without one, once the page is interactive. Server markup uses English until then, so it never disagrees with the client. */
  readonly locale: InputSignal<ProgressOptions["locale"]> = input()
  /** The text screen readers announce for the value, when the formatted value says too little, like "3 of 12 files". It receives the value, null while a progress bar is indeterminate, and details: the `formatted` value, its `percent`, `min` and `max`. */
  readonly getValueLabel: InputSignal<ProgressOptions["getValueLabel"]> =
    input()
  /** How far the task has come, between `min` and `max`. Null means it's under way but how far is unknown, and the bar is indeterminate. */
  readonly value = input(undefined, { transform: nullableNumber })

  readonly handle = usePrimitive(progress, () => ({
    debug: this.debug(),
    min: this.min(),
    max: this.max(),
    format: this.format(),
    locale: this.locale(),
    getValueLabel: this.getValueLabel(),
    value: this.value(),
  }))
  /** The progress's state, as a signal. */
  readonly state = usePart(this.handle, "root").state
}

/**
 * The rail the indicator fills.
 * @experimental
 */
@Directive({ selector: "[uiProgressTrack]", exportAs: "uiProgressTrack" })
class ProgressTrack {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(Progress).handle, "track").state
}

/**
 * The filled part of the track, as wide as the value.
 * @experimental
 */
@Directive({
  selector: "[uiProgressIndicator]",
  exportAs: "uiProgressIndicator",
})
class ProgressIndicator {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(Progress).handle, "indicator").state
}

/**
 * Names the progress bar.
 * @experimental
 */
@Directive({ selector: "[uiProgressLabel]", exportAs: "uiProgressLabel" })
class ProgressLabel {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(Progress).handle, "label").state
}

/**
 * The formatted value, like "40%". Content replaces it.
 * @experimental
 */
@Directive({ selector: "[uiProgressValue]", exportAs: "uiProgressValue" })
class ProgressValue {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(Progress).handle, "value").state

  constructor() {
    useText(() => this.state().text)
  }
}

export type {
  GaugeLabelDetails,
  NumberFormat,
  ProgressOptions,
  ProgressPrimitive,
  ProgressState,
  ProgressStatus,
  ProgressValueState,
} from "@ui-sdk/core/progress"

export {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
}
