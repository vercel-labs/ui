import { Component } from "@angular/core"
import {
  Calendar,
  CalendarGrid,
  CalendarHeading,
  type CalendarMonthChange,
  CalendarMonthSelect,
  CalendarNext,
  CalendarPrevious,
  type CalendarValue,
  type CalendarValueChange,
  CalendarYearSelect,
  createCalendarController,
} from "@ui-sdk/angular/calendar"
import {
  calendarAction,
  calendarFixture,
  calendarOptions,
} from "../../../../../tests/fixtures/calendar"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    Calendar,
    CalendarGrid,
    CalendarHeading,
    CalendarMonthSelect,
    CalendarNext,
    CalendarPrevious,
    CalendarYearSelect,
  ],
  template: `
    <div class="fixture" [attr.lang]="options.lang">
      <button>Before</button>
      <div
        uiCalendar
        class="calendar"
        [today]="f.today"
        [controller]="controller"
        [mode]="options.mode"
        [value]="options.controlled ? value() : undefined"
        [month]="options.controlled ? month() : undefined"
        [defaultValue]="options.controlled ? undefined : options.defaultValue"
        [defaultMonth]="options.controlled ? undefined : options.defaultMonth"
        [min]="options.min"
        [max]="options.max"
        [months]="options.months"
        [pageBy]="options.pageBy"
        [unavailable]="options.unavailable"
        [weekStartsOn]="options.weekStartsOn"
        [fixedWeeks]="options.fixedWeeks"
        [showOutsideDays]="options.showOutsideDays"
        [minDays]="options.minDays"
        [maxDays]="options.maxDays"
        [allowUnavailable]="options.allowUnavailable"
        [disabled]="options.disabled"
        [readOnly]="options.readOnly"
        (beforeValueChange)="onValueChange($event)"
        (beforeMonthChange)="onMonthChange($event)"
      >
        <div class="calendar-header">
          <button uiCalendarPrevious class="calendar-step"></button>
          <h2 uiCalendarHeading class="calendar-heading"></h2>
          @if (options.selects) {
            <select uiCalendarMonthSelect></select>
            <select uiCalendarYearSelect></select>
          }
          <button uiCalendarNext class="calendar-step"></button>
        </div>
        <div class="calendar-months">
          @for (offset of offsets; track offset) {
            <table
              uiCalendarGrid
              class="calendar-grid"
              [offset]="offset"
            ></table>
          }
        </div>
      </div>
      <button (click)="controller.focus(f.controller.date)">
        {{ f.controller.label }}
      </button>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  readonly f = calendarFixture
  readonly controller = createCalendarController()
  readonly options = calendarOptions()
  readonly offsets = Array.from(
    { length: this.options.months ?? 1 },
    (_, offset) => offset
  )
  readonly value = state<CalendarValue>(this.options.defaultValue)
  readonly month = state(
    this.options.defaultMonth ?? calendarFixture.today.slice(0, 7)
  )
  readonly action = state("")

  onValueChange(change: CalendarValueChange<CalendarValue>) {
    this.value.set(change.value)
    this.action.set(calendarAction("value", change.value, change.reason))
  }

  onMonthChange(change: CalendarMonthChange) {
    this.month.set(change.value)
    this.action.set(calendarAction("month", change.value, change.reason))
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
