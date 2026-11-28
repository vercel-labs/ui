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
  dateInput,
  type DateInputOptions,
  type DateInputSegmentProps,
} from "@ui-sdk/core/date-input"
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
type DateInputValueChange = Parameters<
  NonNullable<DateInputOptions["onValueChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<DateInputOptions["onValueChange"]>>[0]
}

const DateInputHandle = new InjectionToken<PrimitiveHandle<typeof dateInput>>(
  "ui-sdk date input"
)

/**
 * A segment, like the month: an input arrow keys step and digits fill, named by its unit. The text between segments renders as a span.
 * @experimental
 */
@Directive({ selector: "[uiDateInputSegment]", exportAs: "uiDateInputSegment" })
class DateInputSegment {
  /** The segment it shows, from the root's `state().segments`. */
  readonly segment = input.required<DateInputSegmentProps["segment"]>()

  /** The segment's state, as a signal. */
  readonly state = usePart(inject(DateInputHandle), "segment", () => ({
    segment: this.segment(),
    id: this.segment().key,
  })).state

  constructor() {
    useText(() => this.state().text)
  }
}

/**
 * The root: a group of segments the locale orders, like month, day and year, and the hidden input the ISO value submits with. Left empty, it renders every segment; to render your own, loop over `state().segments`.
 * @experimental
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "[uiDateInput]",
  exportAs: "uiDateInput",
  imports: [DateInputSegment],
  providers: [
    { provide: DateInputHandle, useFactory: () => inject(DateInput).handle },
  ],
  template: `<ng-content>
    @for (segment of state().segments; track segment.key) {
      @if (segment.editable) {
        <input uiDateInputSegment [segment]="segment" />
      } @else {
        <span uiDateInputSegment [segment]="segment"></span>
      }
    }
  </ng-content>`,
})
class DateInput {
  readonly #field = useFieldControl()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** The value: an ISO date like `"2026-11-02"`, with a time granularity a date and time like `"2026-11-02T14:30"`, or `null`. Bind it with `[(value)]` to control the input. */
  readonly value: InputSignal<DateInputOptions["value"]> = input()
  /** The value it starts with, when uncontrolled, and goes back to when its form resets. */
  readonly defaultValue: InputSignal<DateInputOptions["defaultValue"]> = input()
  /** The new value, after a change that wasn't canceled. */
  readonly valueChange = output<DateInputValueChange["value"]>()
  /** Runs when the value wants to change: once every segment holds something, and again with `null` when one is emptied. `$event.cancel()` keeps the value. */
  readonly beforeValueChange = output<DateInputValueChange>()
  /** The smallest unit it shows. `"day"` shows a date, and `"hour"`, `"minute"` or `"second"` add the time down to it. */
  readonly granularity: InputSignal<DateInputOptions["granularity"]> = input()
  /** A 12 or 24 hour clock for the time. Defaults to the locale's. */
  readonly hourCycle = input(undefined, {
    transform: (value: unknown) =>
      optionalNumber(value) as DateInputOptions["hourCycle"],
  })
  /** The earliest value, as an ISO date or date and time. A value before it is invalid. */
  readonly min: InputSignal<DateInputOptions["min"]> = input()
  /** The latest value. A date alone takes any time that day. A value after it is invalid. */
  readonly max: InputSignal<DateInputOptions["max"]> = input()
  /** Dates that can't be chosen, as in Calendar: ISO dates, `{ from, to }` ranges, weekdays or a function. A value on one is invalid. */
  readonly unavailable: InputSignal<DateInputOptions["unavailable"]> = input()
  /** The language whose order, separators and clock it shows. Defaults to the page's. */
  readonly locale: InputSignal<DateInputOptions["locale"]> = input()
  /** Whether it can't be used. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Whether the value can be seen but not changed. */
  readonly readOnly = input(undefined, { transform: optionalBoolean })
  /** Whether a value must be entered before its form submits. */
  readonly required = input(undefined, { transform: optionalBoolean })
  /** The name the value submits under. */
  readonly name: InputSignal<DateInputOptions["name"]> = input()
  /** The id of the form it belongs to, when it isn't inside it. */
  readonly form: InputSignal<DateInputOptions["form"]> = input()
  /** Drives it from anywhere. Create one with `createDateInputController()`. */
  readonly controller: InputSignal<DateInputOptions["controller"]> = input()

  readonly handle = usePrimitive(dateInput, () => ({
    debug: this.debug(),
    value: this.value(),
    defaultValue: this.defaultValue(),
    onValueChange: emitChange(this.beforeValueChange, this.valueChange),
    granularity: this.granularity(),
    hourCycle: this.hourCycle(),
    min: this.min(),
    max: this.max(),
    unavailable: this.unavailable(),
    locale: this.locale(),
    disabled: this.disabled() || this.#field?.disabled(),
    readOnly: this.readOnly(),
    required: this.required(),
    name: this.name() ?? this.#field?.name(),
    form: this.form(),
    controller: this.controller(),
  }))
  /** The date input's state, as a signal. */
  readonly state = usePart(this.handle, "root", undefined, {
    joined: this.#field?.joined,
  }).state

  constructor() {
    useNativeInput(this.handle, "hidden-input")
  }
}

export { createDateInputController } from "@ui-sdk/core/date-input"
export type {
  DateInputApi,
  DateInputChangeOptions,
  DateInputController,
  DateInputGranularity,
  DateInputOptions,
  DateInputPrimitive,
  DateInputSegmentData,
  DateInputSegmentProps,
  DateInputSegmentState,
  DateInputSegmentType,
  DateInputState,
  DateInputValueChangeReason,
  DateMatcher,
  DateMatchers,
  HourCycle,
} from "@ui-sdk/core/date-input"

export { DateInput, DateInputSegment, type DateInputValueChange }
