import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  effect,
  ElementRef,
  HostAttributeToken,
  Injectable,
  inject,
  input,
  output,
  type InputSignal,
} from "@angular/core"
import {
  datePicker,
  type DatePickerValue,
  type DatePickerContentProps,
  type DatePickerContentState,
  type DatePickerOptions,
  type DatePickerPresetProps,
} from "@ui-sdk/core/date-picker"
import {
  optionalBoolean,
  optionalNumber,
  type StarInput,
  starInputs,
  withStar,
} from "./inputs.ts"
import { emitChange } from "./outputs.ts"
import { useFieldControl } from "./field-context.ts"
import { useNativeInput } from "./native-input.ts"
import {
  PopupRoot,
  PopupScope,
  usePopupContent,
  usePopupRoot,
} from "./popup.ts"
import {
  usePart,
  usePrimitive,
  type Joined,
  type PopupContainer,
  type PrimitiveHandle,
} from "./use-primitive.ts"
import type { calendar } from "@ui-sdk/core/calendar"
import {
  CalendarGrid,
  CalendarHeading,
  CalendarNext,
  CalendarPrevious,
} from "./calendar.ts"
import { CalendarContext, monthOffsets } from "./calendar-context.ts"
import { useText } from "./text.ts"

/**
 * What `(beforeValueChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type DatePickerValueChange<Value = any> = Parameters<
  NonNullable<DatePickerOptions["onValueChange"]>
>[1] & {
  /** The value the change would set. */
  value: Value
}

/**
 * What `(beforeMonthChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type DatePickerMonthChange = Parameters<
  NonNullable<DatePickerOptions["onMonthChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<DatePickerOptions["onMonthChange"]>>[0]
}

/**
 * What `(beforeOpenChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type DatePickerOpenChange = Parameters<
  NonNullable<DatePickerOptions["onOpenChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<DatePickerOptions["onOpenChange"]>>[0]
}

@Injectable()
class DatePickerScope extends PopupRoot<typeof datePicker> {}

/**
 * A text input that reads a date typed in the page's language on Enter or blur. `end` makes it a range's end.
 * @experimental
 */
@Directive({ selector: "[uiDatePickerInput]", exportAs: "uiDatePickerInput" })
class DatePickerInput {
  /** Whether it's a range's end. The input without it holds the start, or the date. */
  readonly end = input(undefined, { transform: optionalBoolean })

  readonly #field = useFieldControl()
  readonly #described = tokens(
    inject(new HostAttributeToken("aria-describedby"), { optional: true }) ??
      undefined
  )
  // A field names the first input. Its description follows the input's own and the format hint's.
  readonly #joined: Joined | undefined = this.#field && {
    part: () => (this.end() ? undefined : this.#field?.joined.part()),
    merge: (own, control) => ({
      ...this.#field?.joined.merge(own, control),
      "aria-describedby":
        [
          ...new Set([
            ...this.#described,
            ...tokens(own["aria-describedby"]),
            ...tokens(control["aria-describedby"]),
          ]),
        ].join(" ") || undefined,
    }),
  }
  /** The input's state, as a signal. */
  readonly state = usePart(
    inject(DatePickerScope).handle,
    "input",
    () => ({ end: this.end() ?? false, id: this.end() ? "end" : "start" }),
    { joined: this.#joined }
  ).state
}

/**
 * Opens the calendar. Named "Choose date" and the date chosen; pass `aria-label` in another language. Left empty, it shows a calendar icon.
 * @experimental
 */
@Directive({
  selector: "[uiDatePickerTrigger]",
  exportAs: "uiDatePickerTrigger",
})
class DatePickerTrigger {
  /** The trigger's state, as a signal. */
  readonly state = usePart(inject(DatePickerScope).handle, "trigger").state

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
    effect(() => {
      if (el.childNodes.length) {
        return
      }
      const shape = (name: string, attrs: Record<string, string>) => {
        const node = el.ownerDocument.createElementNS(
          "http://www.w3.org/2000/svg",
          name
        )
        for (const [attr, value] of Object.entries(attrs)) {
          node.setAttribute(attr, value)
        }
        return node
      }
      const icon = shape("svg", {
        width: "16",
        height: "16",
        viewBox: "0 0 16 16",
        fill: "none",
        stroke: "currentColor",
        "aria-hidden": "true",
      })
      icon.appendChild(
        shape("rect", { x: "2", y: "3", width: "12", height: "11", rx: "1.5" })
      )
      icon.appendChild(shape("path", { d: "M2 6.5h12M5.5 1.5v3M10.5 1.5v3" }))
      el.appendChild(icon)
    })
  }
}

/**
 * The popup. Put Calendar parts inside it, like `uiCalendarHeading` and a `uiCalendarGrid` for each month. `*uiDatePickerContent` renders it only while it's shown.
 * @experimental
 */
@Directive({
  selector: "[uiDatePickerContent]",
  exportAs: "uiDatePickerContent",
  providers: [PopupScope],
})
class DatePickerContent {
  /** Which side of the input the popup opens on. */
  readonly side: InputSignal<DatePickerContentProps["side"]> = input()
  /** How the popup lines up with the input along that side. */
  readonly align: InputSignal<DatePickerContentProps["align"]> = input()
  /** Gap between the input and the popup, in pixels. */
  readonly sideOffset = input(undefined, { transform: optionalNumber })
  /** Shift along the input, in pixels. */
  readonly alignOffset = input(undefined, { transform: optionalNumber })
  /** Space to keep from the viewport edges, in pixels. */
  readonly collisionPadding = input(undefined, { transform: optionalNumber })
  /** Space to keep between the arrow and the popup's corners, in pixels. */
  readonly arrowPadding = input(undefined, { transform: optionalNumber })
  /** Positions the popup against this instead of its trigger: an element, a CSS selector, a point like `{ x, y }`, or anything with `getBoundingClientRect()`. It's read on every check, so it can move. A controller's `open({ anchor })` wins for that open. */
  readonly anchor: InputSignal<DatePickerContentProps["anchor"]> = input()
  /** Where focus goes when the popup closes while focus is inside it. */
  readonly finalFocus: InputSignal<DatePickerContentProps["finalFocus"]> =
    input()
  /** Whether the popup stays in the page, hidden, while closed. Its content keeps its state between opens. */
  readonly keepMounted = input(undefined, { transform: optionalBoolean })
  /** Renders the popup into this element instead of in place. */
  readonly container = input<PopupContainer>()

  /** The inputs as one object, for the `*` form, which leaves other attributes on the element inside: `*uiDatePickerContent="{ side: 'bottom' }"`. */
  readonly uiDatePickerContent: StarInput<DatePickerContentProps> = input(
    undefined,
    { transform: starInputs<DatePickerContentProps> }
  )

  /** The part's state, as a signal. */
  readonly state = usePopupContent(
    inject(DatePickerScope),
    "content",
    () =>
      withStar(this.uiDatePickerContent(), {
        side: this.side(),
        align: this.align(),
        sideOffset: this.sideOffset(),
        alignOffset: this.alignOffset(),
        collisionPadding: this.collisionPadding(),
        arrowPadding: this.arrowPadding(),
        anchor: this.anchor(),
        finalFocus: this.finalFocus(),
        keepMounted: this.keepMounted(),
      }),
    {
      container: () =>
        this.container() ?? this.uiDatePickerContent()?.container,
      viewport: true,
    }
  ).state

  static ngTemplateContextGuard(
    _directive: DatePickerContent,
    context: unknown
  ): context is { $implicit: DatePickerContentState } {
    return true
  }
}

/**
 * The format to type, like "MM/DD/YYYY". The inputs are described by it. Left empty, it shows the format.
 * @experimental
 */
@Directive({ selector: "[uiDatePickerHint]", exportAs: "uiDatePickerHint" })
class DatePickerHint {
  /** The hint's state, as a signal. */
  readonly state = usePart(inject(DatePickerScope).handle, "hint").state

  constructor() {
    useText(() => this.state().placeholder)
  }
}

/**
 * Clears the value and focuses the input.
 * @experimental
 */
@Directive({ selector: "[uiDatePickerClear]", exportAs: "uiDatePickerClear" })
class DatePickerClear {
  /** The button's state, as a signal. */
  readonly state = usePart(inject(DatePickerScope).handle, "clear").state
}

/**
 * Selects the value it holds, like the last 7 days.
 * @experimental
 */
@Directive({ selector: "[uiDatePickerPreset]", exportAs: "uiDatePickerPreset" })
class DatePickerPreset {
  /** The value it selects: an ISO date, or `[start, end]` in range mode. */
  readonly value = input.required<DatePickerPresetProps["value"]>()

  /** The preset's state, as a signal. */
  readonly state = usePart(inject(DatePickerScope).handle, "preset", () => ({
    value: this.value(),
    id: JSON.stringify(this.value()),
  })).state
}

const tokens = (ids: string | undefined) =>
  ids?.split(/\s+/).filter(Boolean) ?? []

/**
 * The root, and the hidden inputs that submit ISO dates. Left empty, it renders an input, or two in range mode, the trigger and the popup with its calendar.
 * @experimental
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "[uiDatePicker]",
  exportAs: "uiDatePicker",
  imports: [
    CalendarGrid,
    CalendarHeading,
    CalendarNext,
    CalendarPrevious,
    DatePickerContent,
    DatePickerInput,
    DatePickerTrigger,
  ],
  providers: [
    DatePickerScope,
    // Every Calendar part works inside the content: the date picker's primitive has the same parts.
    {
      provide: CalendarContext,
      useFactory: () =>
        inject(DatePicker).handle as unknown as PrimitiveHandle<
          typeof calendar
        >,
    },
  ],
  template: `
    <ng-content>
      <input uiDatePickerInput />
      @if (range()) {
        <input uiDatePickerInput end />
      }
      <button uiDatePickerTrigger type="button"></button>
      <div *uiDatePickerContent>
        <div>
          <button uiCalendarPrevious type="button"></button>
          <h2 uiCalendarHeading></h2>
          <button uiCalendarNext type="button"></button>
        </div>
        @for (offset of offsets(); track offset) {
          <table uiCalendarGrid [offset]="offset"></table>
        }
      </div>
    </ng-content>
  `,
})
class DatePicker<Value extends DatePickerValue = any> {
  readonly #field = useFieldControl()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** The first month the calendar shows, like `"2026-10"`. Bind it with `[(month)]` to control the calendar. */
  readonly month: InputSignal<DatePickerOptions["month"]> = input()
  /** The first month it shows, when uncontrolled. Defaults to the selected date's month, else today's. */
  readonly defaultMonth: InputSignal<DatePickerOptions["defaultMonth"]> =
    input()
  /** The earliest date that can be picked. Keys stop there, and Previous stops at its month. */
  readonly min: InputSignal<DatePickerOptions["min"]> = input()
  /** The latest date that can be picked. */
  readonly max: InputSignal<DatePickerOptions["max"]> = input()
  /** Dates that can't be picked, like booked days, as data: ISO dates, `{ from, to }`, `{ weekday: [0, 6] }` for weekends, `{ before }`, `{ after }`, or a function. They stay focusable, so keyboard users hear them. */
  readonly unavailable: InputSignal<DatePickerOptions["unavailable"]> = input()
  /** Whether nothing can be picked or focused. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Whether dates can be focused but not picked. */
  readonly readOnly = input(undefined, { transform: optionalBoolean })
  /** How many months show side by side, each in its own grid. */
  readonly months = input(undefined, { transform: optionalNumber })
  /** Whether Previous, Next and keys turn one month, or all the months shown. */
  readonly pageBy: InputSignal<DatePickerOptions["pageBy"]> = input()
  /** The language of the names and labels. Defaults to the page's `lang`, then the browser's. */
  readonly locale: InputSignal<DatePickerOptions["locale"]> = input()
  /** The first day of the week, 0 for Sunday. Defaults to the locale's. */
  readonly weekStartsOn = input(undefined, { transform: optionalNumber })
  /** How weekday headers are written. */
  readonly weekdayFormat: InputSignal<DatePickerOptions["weekdayFormat"]> =
    input()
  /** How month names are written, in the heading and the month select. */
  readonly monthFormat: InputSignal<DatePickerOptions["monthFormat"]> = input()
  /** Whether every month shows six weeks, so the calendar doesn't change height. */
  readonly fixedWeeks = input(undefined, { transform: optionalBoolean })
  /** Whether the days of the months before and after show at the edges. */
  readonly showOutsideDays = input(undefined, { transform: optionalBoolean })
  /** Today's date, for `aria-current` and the starting month. Defaults to today in `timeZone`, read on the client. */
  readonly today: InputSignal<DatePickerOptions["today"]> = input()
  /** The time zone that says what day today is, like `"America/New_York"`. Defaults to the browser's. */
  readonly timeZone: InputSignal<DatePickerOptions["timeZone"]> = input()
  /** The fewest days a range can span, counting both ends. */
  readonly minDays = input(undefined, { transform: optionalNumber })
  /** The most days a range can span, counting both ends. */
  readonly maxDays = input(undefined, { transform: optionalNumber })
  /** Whether a range may hold unavailable dates, like a stay over a booked night. */
  readonly allowUnavailable = input(undefined, { transform: optionalBoolean })
  /** How many dates it selects: one, or a range from a start to an end, with an input for each. */
  readonly mode: InputSignal<DatePickerOptions["mode"]> = input()
  /** The selected value: an ISO date, `[start, end]` in range mode, or `null`. Bind it with `[(value)]` to control the date picker. */
  readonly value = input<Value>()
  /** The value it starts with, when uncontrolled, and goes back to when its form resets. */
  readonly defaultValue = input<Value>()
  /** The new value, after a change that wasn't canceled. */
  readonly valueChange = output<Value>()
  /** Runs when a date is picked in the calendar (`"item-press"`), a typed date is committed on Enter or blur (`"input-commit"`), a preset or Clear is pressed, the form resets, or a controller sets it. A range changes once both ends are set. `$event.cancel()` keeps the value. */
  readonly beforeValueChange = output<DatePickerValueChange<Value>>()
  /** The new value, after a change that wasn't canceled. */
  readonly monthChange = output<DatePickerMonthChange["value"]>()
  /** Runs when the months the calendar shows want to change, as in Calendar, or a typed date or a preset turns them. */
  readonly beforeMonthChange = output<DatePickerMonthChange>()
  /** Whether the popup is open. Bind it with `[(open)]` to control the popup. */
  readonly open = input(undefined, { transform: optionalBoolean })
  /** Whether the popup starts open, when uncontrolled. */
  readonly defaultOpen = input(undefined, { transform: optionalBoolean })
  /** The new value, after a change that wasn't canceled. */
  readonly openChange = output<DatePickerOpenChange["value"]>()
  /** Runs when the popup wants to open or close. `$event.reason` says why, and `$event.cancel()` stops it. */
  readonly beforeOpenChange = output<DatePickerOpenChange>()
  /** Runs once the popup has finished opening or closing, after any animation. */
  readonly openChangeComplete =
    output<
      Parameters<NonNullable<DatePickerOptions["onOpenChangeComplete"]>>[0]
    >()
  /** Whether picking a date, or a range's end, or pressing a preset closes the popup. */
  readonly closeOnSelect = input(undefined, { transform: optionalBoolean })
  /** How the popup presents. `"sheet"` slides it up from the bottom of the screen, and `"auto"` does that on small touch screens. */
  readonly presentation: InputSignal<DatePickerOptions["presentation"]> =
    input()
  /** The name the date submits under, as an ISO date. In range mode, both ends submit under it unless `startName` and `endName` are set. */
  readonly name: InputSignal<DatePickerOptions["name"]> = input()
  /** The name a range's start submits under. */
  readonly startName: InputSignal<DatePickerOptions["startName"]> = input()
  /** The name a range's end submits under. */
  readonly endName: InputSignal<DatePickerOptions["endName"]> = input()
  /** Renders the popup into this element instead of in place. */
  readonly container = input<PopupContainer>()
  /** The id of the form it belongs to, when it isn't inside it. */
  readonly form: InputSignal<DatePickerOptions["form"]> = input()
  /** Whether a date must be entered before its form submits. */
  readonly required = input(undefined, { transform: optionalBoolean })
  /** Drives it from anywhere. Create one with `createDatePickerController()`. */
  readonly controller: InputSignal<DatePickerOptions["controller"]> = input()
  /** Whether Escape, an outside press, focus or the window leaving, Android's back gesture and a sheet's swipe can close it. Triggers, Close parts and the controller always can. Pass `false` while it holds unsaved work, and ask in `onDismissAttempt`. */
  readonly dismissible = input(undefined, { transform: optionalBoolean })
  /** Runs when `dismissible` refused a dismissal made on purpose: Escape, an outside press, back or a swipe. Focus or the window leaving is refused without it. Ask "Discard changes?" here. */
  readonly dismissAttempt =
    output<Parameters<NonNullable<DatePickerOptions["onDismissAttempt"]>>[0]>()

  readonly handle = usePrimitive(datePicker, () => ({
    debug: this.debug(),
    month: this.month(),
    defaultMonth: this.defaultMonth(),
    min: this.min(),
    max: this.max(),
    unavailable: this.unavailable(),
    disabled: this.disabled() || this.#field?.disabled(),
    readOnly: this.readOnly(),
    months: this.months(),
    pageBy: this.pageBy(),
    locale: this.locale(),
    weekStartsOn: this.weekStartsOn(),
    weekdayFormat: this.weekdayFormat(),
    monthFormat: this.monthFormat(),
    fixedWeeks: this.fixedWeeks(),
    showOutsideDays: this.showOutsideDays(),
    today: this.today(),
    timeZone: this.timeZone(),
    minDays: this.minDays(),
    maxDays: this.maxDays(),
    allowUnavailable: this.allowUnavailable(),
    mode: this.mode(),
    value: this.value(),
    defaultValue: this.defaultValue(),
    onValueChange: emitChange<DatePickerValueChange>(
      this.beforeValueChange,
      this.valueChange
    ),
    onMonthChange: emitChange(this.beforeMonthChange, this.monthChange),
    open: this.open(),
    defaultOpen: this.defaultOpen(),
    onOpenChange: emitChange(this.beforeOpenChange, this.openChange),
    onOpenChangeComplete: (value) => this.openChangeComplete.emit(value),
    closeOnSelect: this.closeOnSelect(),
    presentation: this.presentation(),
    name: this.name() ?? this.#field?.name(),
    startName: this.startName(),
    endName: this.endName(),
    form: this.form(),
    required: this.required(),
    controller: this.controller(),
    dismissible: this.dismissible(),
    onDismissAttempt: (value) => this.dismissAttempt.emit(value),
  }))
  /** The date picker's state, as a signal. */
  readonly state = usePart(this.handle, "root").state
  protected readonly range = computed(() => this.state().mode === "range")
  protected readonly offsets = computed(() => monthOffsets(this.months()))

  constructor() {
    usePopupRoot(
      DatePickerScope,
      { handle: this.handle, container: this.container },
      () => this.controller()
    )
    // A hidden input renders only for a date that submits under a name.
    const name = () => this.name() ?? this.#field?.name()
    useNativeInput(
      this.handle,
      "hidden-input",
      () => ({ id: "start" }),
      undefined,
      () => (this.range() ? (this.startName() ?? name()) : name())
    )
    useNativeInput(
      this.handle,
      "hidden-input",
      () => ({ end: true, id: "end" }),
      undefined,
      () => this.range() && (this.endName() ?? name())
    )
  }
}

export {
  CalendarDay,
  CalendarGrid,
  CalendarHeading,
  CalendarMonthSelect,
  CalendarNext,
  CalendarPrevious,
  CalendarWeekday,
  CalendarWeekdays,
  CalendarWeeks,
  CalendarYearSelect,
} from "./calendar.ts"
export { createDatePickerController } from "@ui-sdk/core/date-picker"
export type {
  CalendarDayState,
  CalendarGridCell,
  CalendarGridState,
  CalendarHeadingState,
  CalendarSelectOption,
  CalendarSelectState,
  CalendarStepState,
  CalendarWeekdayState,
  DateMatcher,
  DateMatchers,
  DatePickerApi,
  DatePickerChangeOptions,
  DatePickerClearState,
  DatePickerContentProps,
  DatePickerContentState,
  DatePickerController,
  DatePickerDismissReason,
  DatePickerHintState,
  DatePickerInputProps,
  DatePickerInputState,
  DatePickerMode,
  DatePickerMonthChangeReason,
  DatePickerOpenChangeReason,
  DatePickerOptions,
  DatePickerPresetProps,
  DatePickerPresetState,
  DatePickerPrimitive,
  DatePickerState,
  DatePickerTriggerState,
  DatePickerValue,
  DatePickerValueChangeReason,
  ISOMonth,
} from "@ui-sdk/core/date-picker"

export {
  DatePicker,
  DatePickerClear,
  DatePickerContent,
  DatePickerHint,
  DatePickerInput,
  type DatePickerMonthChange,
  type DatePickerOpenChange,
  DatePickerPreset,
  DatePickerTrigger,
  type DatePickerValueChange,
}
