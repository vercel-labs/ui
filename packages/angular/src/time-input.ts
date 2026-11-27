import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  inject,
  InjectionToken,
  input,
  output,
  type InputSignal,
} from "@angular/core"
import {
  timeInput,
  type TimeInputOptions,
  type TimeInputSegmentProps,
} from "@ui-sdk/core/time-input"
import { optionalBoolean, optionalNumber } from "./inputs.ts"
import { emitChange } from "./outputs.ts"
import { useFieldControl } from "./field-context.ts"
import { useNativeInput } from "./native-input.ts"
import { useText } from "./text.ts"
import { usePart, usePrimitive, type PrimitiveHandle } from "./use-primitive.ts"

/**
 * What `(beforeValueChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type TimeInputValueChange = Parameters<
  NonNullable<TimeInputOptions["onValueChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<TimeInputOptions["onValueChange"]>>[0]
}

const TimeInputHandle = new InjectionToken<PrimitiveHandle<typeof timeInput>>(
  "ui-sdk time input"
)

/**
 * A segment, like the hour: an input arrow keys step and digits fill, named by its unit. The text between segments renders as a span.
 * @experimental
 */
@Directive({ selector: "[uiTimeInputSegment]", exportAs: "uiTimeInputSegment" })
class TimeInputSegment {
  /** The segment it shows, from the root's `state().segments`. */
  readonly segment = input.required<TimeInputSegmentProps["segment"]>()

  /** The segment's state, as a signal. */
  readonly state = usePart(inject(TimeInputHandle), "segment", () => ({
    segment: this.segment(),
    id: this.segment().key,
  })).state

  constructor() {
    useText(() => this.state().text)
  }
}

/**
 * The root: a group of segments, hours and minutes, with seconds and AM/PM when shown, and the hidden input the time submits with. Left empty, it renders every segment; to render your own, loop over `state().segments`.
 * @experimental
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "[uiTimeInput]",
  exportAs: "uiTimeInput",
  imports: [TimeInputSegment],
  providers: [
    { provide: TimeInputHandle, useFactory: () => inject(TimeInput).handle },
  ],
  template: `<ng-content>
    @for (segment of state().segments; track segment.key) {
      @if (segment.editable) {
        <input uiTimeInputSegment [segment]="segment" />
      } @else {
        <span uiTimeInputSegment [segment]="segment"></span>
      }
    }
  </ng-content>`,
})
class TimeInput {
  readonly #field = useFieldControl()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** The value: a time like `"14:30"`, or `"14:30:15"` with seconds, or `null`. Bind it with `[(value)]` to control the input. */
  readonly value: InputSignal<TimeInputOptions["value"]> = input()
  /** The value it starts with, when uncontrolled, and goes back to when its form resets. */
  readonly defaultValue: InputSignal<TimeInputOptions["defaultValue"]> = input()
  /** The new value, after a change that wasn't canceled. */
  readonly valueChange = output<TimeInputValueChange["value"]>()
  /** Runs when the value wants to change: once every segment holds something, and again with `null` when one is emptied. `$event.cancel()` keeps the value. */
  readonly beforeValueChange = output<TimeInputValueChange>()
  /** The smallest unit it shows. */
  readonly granularity: InputSignal<TimeInputOptions["granularity"]> = input()
  /** A 12 or 24 hour clock. Defaults to the locale's. */
  readonly hourCycle = input(undefined, {
    transform: (value: unknown) =>
      optionalNumber(value) as TimeInputOptions["hourCycle"],
  })
  /** The earliest time, like `"09:00"`. A time before it is invalid. */
  readonly min: InputSignal<TimeInputOptions["min"]> = input()
  /** The latest time, like `"17:30"`. A time after it is invalid. */
  readonly max: InputSignal<TimeInputOptions["max"]> = input()
  /** The language whose separators and clock it shows. Defaults to the page's. */
  readonly locale: InputSignal<TimeInputOptions["locale"]> = input()
  /** Whether it can't be used. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Whether the value can be seen but not changed. */
  readonly readOnly = input(undefined, { transform: optionalBoolean })
  /** Whether a time must be entered before its form submits. */
  readonly required = input(undefined, { transform: optionalBoolean })
  /** The name the value submits under. */
  readonly name: InputSignal<TimeInputOptions["name"]> = input()
  /** The id of the form it belongs to, when it isn't inside it. */
  readonly form: InputSignal<TimeInputOptions["form"]> = input()
  /** Drives it from anywhere. Create one with `createTimeInputController()`. */
  readonly controller: InputSignal<TimeInputOptions["controller"]> = input()

  readonly handle = usePrimitive(timeInput, () => ({
    debug: this.debug(),
    value: this.value(),
    defaultValue: this.defaultValue(),
    onValueChange: emitChange(this.beforeValueChange, this.valueChange),
    granularity: this.granularity(),
    hourCycle: this.hourCycle(),
    min: this.min(),
    max: this.max(),
    locale: this.locale(),
    disabled: this.disabled() || this.#field?.disabled(),
    readOnly: this.readOnly(),
    required: this.required(),
    name: this.name() ?? this.#field?.name(),
    form: this.form(),
    controller: this.controller(),
  }))
  /** The time input's state, as a signal. */
  readonly state = usePart(this.handle, "root", undefined, {
    joined: this.#field?.joined,
  }).state

  constructor() {
    useNativeInput(this.handle, "hidden-input")
  }
}

export { createTimeInputController } from "@ui-sdk/core/time-input"
export type {
  HourCycle,
  TimeInputApi,
  TimeInputChangeOptions,
  TimeInputController,
  TimeInputGranularity,
  TimeInputOptions,
  TimeInputPrimitive,
  TimeInputSegmentData,
  TimeInputSegmentProps,
  TimeInputSegmentState,
  TimeInputSegmentType,
  TimeInputState,
  TimeInputValueChangeReason,
} from "@ui-sdk/core/time-input"

export { TimeInput, TimeInputSegment, type TimeInputValueChange }
