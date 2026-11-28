import { Component, signal } from "@angular/core"
import {
  LucideCalendar,
  LucideChevronLeft,
  LucideChevronRight,
} from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  CalendarDay,
  CalendarGrid,
  CalendarHeading,
  CalendarNext,
  CalendarPrevious,
  CalendarWeekday,
  CalendarWeekdays,
  CalendarWeeks,
  DatePicker,
  DatePickerContent,
  DatePickerHint,
  DatePickerInput,
  DatePickerTrigger,
  type DatePickerValue,
} from "@ui-sdk/angular/date-picker"

@Component({
  imports: [
    CalendarDay,
    CalendarGrid,
    CalendarHeading,
    CalendarNext,
    CalendarPrevious,
    CalendarWeekday,
    CalendarWeekdays,
    CalendarWeeks,
    DatePicker,
    DatePickerContent,
    DatePickerHint,
    DatePickerInput,
    DatePickerTrigger,
    LucideCalendar,
    LucideChevronLeft,
    LucideChevronRight,
  ],
  template: `
    <div
      uiDatePicker
      [(value)]="value"
      (beforeValueChange)="
        log(($event.value ?? 'No date') + ' (' + $event.reason + ')')
      "
    >
      <div data-slot="row">
        <input uiDatePickerInput aria-label="Due date" />
        <button uiDatePickerTrigger data-variant="ghost">
          <svg lucideCalendar></svg>
        </button>
      </div>
      <span uiDatePickerHint></span>
      <div *uiDatePickerContent>
        <div data-slot="row">
          <button uiCalendarPrevious data-variant="ghost">
            <svg lucideChevronLeft></svg>
          </button>
          <h2 uiCalendarHeading></h2>
          <button uiCalendarNext data-variant="ghost">
            <svg lucideChevronRight></svg>
          </button>
        </div>
        <table uiCalendarGrid>
          <thead uiCalendarWeekdays>
            <ng-template let-index>
              <th uiCalendarWeekday [index]="index"></th>
            </ng-template>
          </thead>
          <tbody uiCalendarWeeks>
            <ng-template let-cell>
              <td uiCalendarDay [value]="cell.date"></td>
            </ng-template>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
class Example {
  readonly log = useLog()

  readonly value = signal<DatePickerValue>("2026-10-16")
}

export { Example }
