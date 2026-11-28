import {
  Directive,
  inject,
  input,
  numberAttribute,
  type InputSignal,
} from "@angular/core"
import { meter, type MeterOptions } from "@ui-sdk/core/meter"
import { optionalBoolean, optionalNumber } from "./inputs.ts"
import { useText } from "./text.ts"
import { usePart, usePrimitive } from "./use-primitive.ts"

/**
 * The root, which is the meter.
 * @experimental
 */
@Directive({ selector: "[uiMeter]", exportAs: "uiMeter" })
class Meter {
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** The lowest value. */
  readonly min = input(undefined, { transform: optionalNumber })
  /** The highest value. */
  readonly max = input(undefined, { transform: optionalNumber })
  /** How the value reads, for screen readers and the Value part: `Intl.NumberFormat` options, or a function of the value. A percent style shows where the value sits between `min` and `max`; any other style shows the value itself, like `{ style: "unit", unit: "gigabyte" }`. */
  readonly format: InputSignal<MeterOptions["format"]> = input()
  /** The locale the value is formatted in. Defaults to the page's `lang`, or the browser's language without one, once the page is interactive. Server markup uses English until then, so it never disagrees with the client. */
  readonly locale: InputSignal<MeterOptions["locale"]> = input()
  /** The text screen readers announce for the value, when the formatted value says too little, like "3 of 12 files". It receives the value, null while a progress bar is indeterminate, and details: the `formatted` value, its `percent`, `min` and `max`. */
  readonly getValueLabel: InputSignal<MeterOptions["getValueLabel"]> = input()
  /** The reading, between `min` and `max`. Outside them, the fill, the percentage and `aria-valuenow` are clamped, while the state keeps the value as given. A meter always has a value, since there's no busy state. */
  readonly value = input.required({ transform: numberAttribute })

  readonly handle = usePrimitive(meter, () => ({
    debug: this.debug(),
    min: this.min(),
    max: this.max(),
    format: this.format(),
    locale: this.locale(),
    getValueLabel: this.getValueLabel(),
    value: this.value(),
  }))
  /** The meter's state, as a signal. */
  readonly state = usePart(this.handle, "root").state
}

/**
 * The rail the indicator fills.
 * @experimental
 */
@Directive({ selector: "[uiMeterTrack]", exportAs: "uiMeterTrack" })
class MeterTrack {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(Meter).handle, "track").state
}

/**
 * The filled part of the track, as wide as the value.
 * @experimental
 */
@Directive({ selector: "[uiMeterIndicator]", exportAs: "uiMeterIndicator" })
class MeterIndicator {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(Meter).handle, "indicator").state
}

/**
 * Names the meter.
 * @experimental
 */
@Directive({ selector: "[uiMeterLabel]", exportAs: "uiMeterLabel" })
class MeterLabel {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(Meter).handle, "label").state
}

/**
 * The formatted value, like "40%". Content replaces it.
 * @experimental
 */
@Directive({ selector: "[uiMeterValue]", exportAs: "uiMeterValue" })
class MeterValue {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(Meter).handle, "value").state

  constructor() {
    useText(() => this.state().text)
  }
}

export type {
  MeterLabelDetails,
  MeterOptions,
  MeterPrimitive,
  MeterState,
  MeterValueState,
  NumberFormat,
} from "@ui-sdk/core/meter"

export { Meter, MeterIndicator, MeterLabel, MeterTrack, MeterValue }
