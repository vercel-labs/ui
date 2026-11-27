import {
  ChangeDetectionStrategy,
  afterRenderEffect,
  Component,
  computed,
  contentChild,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  numberAttribute,
  output,
  TemplateRef,
  type InputSignal,
} from "@angular/core"
import {
  calendar,
  type CalendarValue,
  type CalendarDayProps,
  type CalendarOptions,
} from "@ui-sdk/core/calendar"
import { optionalBoolean, optionalNumber } from "./inputs.ts"
import { emitChange } from "./outputs.ts"
import { usePart, usePrimitive } from "./use-primitive.ts"
import {
  CalendarCell,
  CalendarContext,
  CalendarGridContext,
  CalendarWeek,
  CalendarWeekdaysRow,
  monthOffsets,
} from "./calendar-context.ts"
import { useText } from "./text.ts"

/**
 * What `(beforeValueChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type CalendarValueChange<Value = any> = Parameters<
  NonNullable<CalendarOptions["onValueChange"]>
>[1] & {
  /** The value the change would set. */
  value: Value
}

/**
 * What `(beforeMonthChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type CalendarMonthChange = Parameters<
  NonNullable<CalendarOptions["onMonthChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<CalendarOptions["onMonthChange"]>>[0]
}

/**
 * What `(beforeFocusedChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type CalendarFocusedChange = Parameters<
  NonNullable<CalendarOptions["onFocusedChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<CalendarOptions["onFocusedChange"]>>[0]
}

/**
 * What `(beforeAnchorChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type CalendarAnchorChange = Parameters<
  NonNullable<CalendarOptions["onAnchorChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<CalendarOptions["onAnchorChange"]>>[0]
}

/**
 * The months shown, like "October 2026". Screen readers hear it change. Left empty, it shows them.
 * @experimental
 */
@Directive({ selector: "[uiCalendarHeading]", exportAs: "uiCalendarHeading" })
class CalendarHeading {
  /** The heading's state, as a signal. */
  readonly state = usePart(inject(CalendarContext), "heading").state

  constructor() {
    useText(() => this.state().label)
  }
}

/**
 * Shows the month before. Named "Previous month"; pass `aria-label` in another language. Left empty, it shows "‹".
 * @experimental
 */
@Directive({ selector: "[uiCalendarPrevious]", exportAs: "uiCalendarPrevious" })
class CalendarPrevious {
  /** The button's state, as a signal. */
  readonly state = usePart(inject(CalendarContext), "previous").state

  constructor() {
    useText(() => "‹")
  }
}

/**
 * Shows the month after. Named "Next month"; pass `aria-label` in another language. Left empty, it shows "›".
 * @experimental
 */
@Directive({ selector: "[uiCalendarNext]", exportAs: "uiCalendarNext" })
class CalendarNext {
  /** The button's state, as a signal. */
  readonly state = usePart(inject(CalendarContext), "next").state

  constructor() {
    useText(() => "›")
  }
}

/**
 * A native select of the months, in the locale, that turns the first month shown. Left empty, it renders its options.
 * @experimental
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "[uiCalendarMonthSelect]",
  exportAs: "uiCalendarMonthSelect",
  template: `
    <ng-content>
      @for (option of state().options; track option.value) {
        <option
          [value]="option.value"
          [disabled]="option.disabled"
          [selected]="option.value === state().value"
        >
          {{ option.label }}
        </option>
      }
    </ng-content>
  `,
})
class CalendarMonthSelect {
  /** The select's state, as a signal. Its `options` are the months to render. */
  readonly state = usePart(inject(CalendarContext), "month-select").state
}

/**
 * A native select of the years from `min` to `max`, or 10 either side of the year shown. Left empty, it renders its options.
 * @experimental
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "[uiCalendarYearSelect]",
  exportAs: "uiCalendarYearSelect",
  template: `
    <ng-content>
      @for (option of state().options; track option.value) {
        <option
          [value]="option.value"
          [disabled]="option.disabled"
          [selected]="option.value === state().value"
        >
          {{ option.label }}
        </option>
      }
    </ng-content>
  `,
})
class CalendarYearSelect {
  /** The select's state, as a signal. Its `options` are the years to render. */
  readonly state = usePart(inject(CalendarContext), "year-select").state
}

/**
 * A weekday's column header. Left empty, it shows its name in `weekdayFormat`.
 * @experimental
 */
@Directive({
  selector: "[uiCalendarWeekday]",
  exportAs: "uiCalendarWeekday",
  host: { scope: "col" },
})
class CalendarWeekday {
  /** The column, from 0. */
  readonly index = input.required({ transform: numberAttribute })

  readonly #grid = inject(CalendarGridContext)
  /** The weekday's state, as a signal. */
  readonly state = usePart(inject(CalendarContext), "weekday", () => ({
    index: this.index(),
    id: `${this.#grid.offset()}-${this.index()}`,
  })).state

  constructor() {
    useText(() => this.state().label)
  }
}

/**
 * A day, on a `<td>`. Left empty, it shows the day of the month. Arrow keys move between days.
 * @experimental
 */
@Directive({ selector: "[uiCalendarDay]", exportAs: "uiCalendarDay" })
class CalendarDay {
  /** Its ISO date, like `"2026-10-27"`. */
  readonly value = input.required<CalendarDayProps["value"]>()

  readonly #grid = inject(CalendarGridContext, { optional: true })
  /** The day's state, as a signal. */
  readonly state = usePart(inject(CalendarContext), "day", () => ({
    value: this.value(),
    offset: this.#grid?.offset() ?? 0,
  })).state

  constructor() {
    useText(() => this.state().label)
  }
}

/**
 * The header of weekday names, on a `<thead>`. It renders the row, with a weekday in each column. To render a column's header yourself, put a template inside: `<ng-template let-index><th uiCalendarWeekday [index]="index"></th></ng-template>`.
 * @experimental
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "[uiCalendarWeekdays]",
  exportAs: "uiCalendarWeekdays",
  imports: [CalendarCell, CalendarWeekday, CalendarWeekdaysRow],
  template: `
    <tr uiCalendarWeekdaysRow>
      @for (weekday of grid.state().weekdays; track weekday) {
        @if (header(); as header) {
          <ng-container [uiCalendarCell]="header" [value]="$index" />
        } @else {
          <th uiCalendarWeekday [index]="$index"></th>
        }
      }
    </tr>
  `,
})
class CalendarWeekdays {
  protected readonly grid = inject(CalendarGridContext)
  protected readonly header = contentChild(TemplateRef)
}

/**
 * The weeks, on a `<tbody>`. It renders a row per week, with a day in each cell. To render a day yourself, put a template inside: `<ng-template let-cell><td uiCalendarDay [value]="cell.date"></td></ng-template>`.
 * @experimental
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "[uiCalendarWeeks]",
  exportAs: "uiCalendarWeeks",
  imports: [CalendarCell, CalendarDay, CalendarWeek],
  template: `
    @for (week of grid.state().weeks; track week[0]!.date) {
      <tr uiCalendarWeek [index]="$index">
        @for (cell of week; track cell.date) {
          @if (cell.hidden) {
            <td></td>
          } @else if (day(); as day) {
            <ng-container [uiCalendarCell]="day" [value]="cell" />
          } @else {
            <td uiCalendarDay [value]="cell.date"></td>
          }
        }
      </tr>
    }
  `,
})
class CalendarWeeks {
  protected readonly grid = inject(CalendarGridContext)
  protected readonly day = contentChild(TemplateRef)

  constructor() {
    const host: HTMLElement = inject(ElementRef).nativeElement
    let focused: HTMLElement | null = null
    effect(() => {
      this.grid.state()
      const active = host.ownerDocument.activeElement
      focused = active && host.contains(active) ? (active as HTMLElement) : null
    })
    // Angular moves a week that stays by taking its row out of the page, which
    // drops focus from a day in it. The day takes focus back.
    afterRenderEffect(() => {
      this.grid.state()
      const moved = focused
      focused = null
      const { activeElement, body } = host.ownerDocument
      if (moved?.isConnected && activeElement === body) {
        moved.focus({ preventScroll: true })
      }
    })
  }
}

/**
 * One month's grid, on a `<table>`. `offset` picks which of the months shown, from 0. Left empty, it renders its weekdays and weeks.
 * @experimental
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "[uiCalendarGrid]",
  exportAs: "uiCalendarGrid",
  imports: [CalendarWeekdays, CalendarWeeks],
  providers: [
    {
      provide: CalendarGridContext,
      useFactory: () => inject(CalendarGrid),
    },
  ],
  template: `
    <ng-content>
      <thead uiCalendarWeekdays></thead>
      <tbody uiCalendarWeeks></tbody>
    </ng-content>
  `,
})
class CalendarGrid {
  /** Which of the months shown it is, from 0. */
  readonly offset = input(0, { transform: numberAttribute })

  /** The grid's state, as a signal. Its `weekdays` and `weeks` are what to render. */
  readonly state = usePart(inject(CalendarContext), "grid", () => ({
    offset: this.offset(),
    id: String(this.offset()),
  })).state
}

/**
 * Months of days with one tab stop. Without content it renders a heading, Previous and Next, and a grid for each month.
 * @experimental
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "[uiCalendar]",
  exportAs: "uiCalendar",
  imports: [CalendarGrid, CalendarHeading, CalendarNext, CalendarPrevious],
  providers: [
    { provide: CalendarContext, useFactory: () => inject(Calendar).handle },
  ],
  template: `
    <ng-content>
      <div>
        <button uiCalendarPrevious type="button"></button>
        <h2 uiCalendarHeading></h2>
        <button uiCalendarNext type="button"></button>
      </div>
      @for (offset of offsets(); track offset) {
        <table uiCalendarGrid [offset]="offset"></table>
      }
    </ng-content>
  `,
})
class Calendar<Value extends CalendarValue = any> {
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** How many dates it selects: one, any number, or a range from a start to an end. */
  readonly mode: InputSignal<CalendarOptions["mode"]> = input()
  /** The selected value: an ISO date, a list of them, or `[start, end]`. Bind it with `[(value)]` to control the calendar. */
  readonly value = input<Value>()
  /** The value it starts with, when uncontrolled. */
  readonly defaultValue = input<Value>()
  /** The new value, after a change that wasn't canceled. */
  readonly valueChange = output<Value>()
  /** Runs when a date is pressed (`"item-press"`), with Enter or Space too, or a controller sets the value (`"imperative"`). A range changes once both ends are picked. `$event.cancel()` keeps the value. */
  readonly beforeValueChange = output<CalendarValueChange<Value>>()
  /** The new value, after a change that wasn't canceled. */
  readonly monthChange = output<CalendarMonthChange["value"]>()
  /** Runs when the months shown want to change: Previous or Next, a key moving focus to another month, a press on a day of another month, or a controller. */
  readonly beforeMonthChange = output<CalendarMonthChange>()
  /** The first month shown, like `"2026-10"`. Bind it with `[(month)]` to control the calendar. */
  readonly month: InputSignal<CalendarOptions["month"]> = input()
  /** The first month it shows, when uncontrolled. Defaults to the selected date's month, else today's. */
  readonly defaultMonth: InputSignal<CalendarOptions["defaultMonth"]> = input()
  /** The earliest date that can be picked. Keys stop there, and Previous stops at its month. */
  readonly min: InputSignal<CalendarOptions["min"]> = input()
  /** The latest date that can be picked. */
  readonly max: InputSignal<CalendarOptions["max"]> = input()
  /** Dates that can't be picked, like booked days, as data: ISO dates, `{ from, to }`, `{ weekday: [0, 6] }` for weekends, `{ before }`, `{ after }`, or a function. They stay focusable, so keyboard users hear them. */
  readonly unavailable: InputSignal<CalendarOptions["unavailable"]> = input()
  /** Whether nothing can be picked or focused. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Whether dates can be focused but not picked. */
  readonly readOnly = input(undefined, { transform: optionalBoolean })
  /** Whether pressing the selected date again clears it, in `"single"` mode. */
  readonly deselectable = input(undefined, { transform: optionalBoolean })
  /** The new value, after a change that wasn't canceled. */
  readonly focusedChange = output<CalendarFocusedChange["value"]>()
  /** Runs before keys, a press or `focus()` move focus to another day. Canceling keeps focus where it was. */
  readonly beforeFocusedChange = output<CalendarFocusedChange>()
  /** The new value, after a change that wasn't canceled. */
  readonly anchorChange = output<CalendarAnchorChange["value"]>()
  /** Runs before a press starts a range, or ends it or Escape drops it, with `null`. Canceling keeps the start as it was. */
  readonly beforeAnchorChange = output<CalendarAnchorChange>()
  /** How many months show side by side, each in its own grid. */
  readonly months = input(undefined, { transform: optionalNumber })
  /** Whether Previous, Next and keys turn one month, or all the months shown. */
  readonly pageBy: InputSignal<CalendarOptions["pageBy"]> = input()
  /** The language of the names and labels. Defaults to the page's `lang`, then the browser's. */
  readonly locale: InputSignal<CalendarOptions["locale"]> = input()
  /** The first day of the week, 0 for Sunday. Defaults to the locale's. */
  readonly weekStartsOn = input(undefined, { transform: optionalNumber })
  /** How weekday headers are written. */
  readonly weekdayFormat: InputSignal<CalendarOptions["weekdayFormat"]> =
    input()
  /** How month names are written, in the heading and the month select. */
  readonly monthFormat: InputSignal<CalendarOptions["monthFormat"]> = input()
  /** Whether every month shows six weeks, so the calendar doesn't change height. */
  readonly fixedWeeks = input(undefined, { transform: optionalBoolean })
  /** Whether the days of the months before and after show at the edges. */
  readonly showOutsideDays = input(undefined, { transform: optionalBoolean })
  /** Today's date, for `aria-current` and the starting month. Defaults to today in `timeZone`, read on the client. */
  readonly today: InputSignal<CalendarOptions["today"]> = input()
  /** The time zone that says what day today is, like `"America/New_York"`. Defaults to the browser's. */
  readonly timeZone: InputSignal<CalendarOptions["timeZone"]> = input()
  /** The fewest days a range can span, counting both ends. */
  readonly minDays = input(undefined, { transform: optionalNumber })
  /** The most days a range can span, counting both ends. */
  readonly maxDays = input(undefined, { transform: optionalNumber })
  /** Whether a range may hold unavailable dates, like a stay over a booked night. */
  readonly allowUnavailable = input(undefined, { transform: optionalBoolean })
  /** Drives it from anywhere. Create one with `createCalendarController()`. */
  readonly controller: InputSignal<CalendarOptions["controller"]> = input()

  readonly handle = usePrimitive(calendar, () => ({
    debug: this.debug(),
    mode: this.mode(),
    value: this.value(),
    defaultValue: this.defaultValue(),
    onValueChange: emitChange<CalendarValueChange>(
      this.beforeValueChange,
      this.valueChange
    ),
    onMonthChange: emitChange(this.beforeMonthChange, this.monthChange),
    month: this.month(),
    defaultMonth: this.defaultMonth(),
    min: this.min(),
    max: this.max(),
    unavailable: this.unavailable(),
    disabled: this.disabled(),
    readOnly: this.readOnly(),
    deselectable: this.deselectable(),
    onFocusedChange: emitChange(this.beforeFocusedChange, this.focusedChange),
    onAnchorChange: emitChange(this.beforeAnchorChange, this.anchorChange),
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
    controller: this.controller(),
  }))
  /** The calendar's state, as a signal. */
  readonly state = usePart(this.handle, "root").state
  protected readonly offsets = computed(() => monthOffsets(this.months()))
}

export { createCalendarController } from "@ui-sdk/core/calendar"
export type {
  CalendarAnchorChangeReason,
  CalendarApi,
  CalendarChangeOptions,
  CalendarController,
  CalendarDayProps,
  CalendarDayState,
  CalendarFocusedChangeReason,
  CalendarGridCell,
  CalendarGridProps,
  CalendarGridState,
  CalendarHeadingState,
  CalendarMode,
  CalendarMonthChangeReason,
  CalendarOptions,
  CalendarPrimitive,
  CalendarSelectOption,
  CalendarSelectState,
  CalendarState,
  CalendarStepState,
  CalendarValue,
  CalendarValueChangeReason,
  CalendarWeekdayProps,
  CalendarWeekdayState,
  DateMatcher,
  DateMatchers,
  ISOMonth,
} from "@ui-sdk/core/calendar"

export {
  Calendar,
  type CalendarAnchorChange,
  CalendarDay,
  type CalendarFocusedChange,
  CalendarGrid,
  CalendarHeading,
  type CalendarMonthChange,
  CalendarMonthSelect,
  CalendarNext,
  CalendarPrevious,
  type CalendarValueChange,
  CalendarWeekday,
  CalendarWeekdays,
  CalendarYearSelect,
  CalendarWeeks,
}
