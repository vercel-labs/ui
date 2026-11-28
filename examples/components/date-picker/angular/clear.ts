import { Component } from "@angular/core"
import {
  LucideCalendar,
  LucideChevronLeft,
  LucideChevronRight,
  LucideX,
} from "@lucide/angular"
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
  DatePickerClear,
  DatePickerContent,
  DatePickerHint,
  DatePickerInput,
  DatePickerTrigger,
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
    DatePickerClear,
    DatePickerContent,
    DatePickerHint,
    DatePickerInput,
    DatePickerTrigger,
    LucideCalendar,
    LucideChevronLeft,
    LucideChevronRight,
    LucideX,
  ],
  template: `
    <div uiDatePicker defaultValue="2026-10-16">
      <div data-slot="row">
        <input uiDatePickerInput aria-label="Due date" />
        <button uiDatePickerClear data-variant="ghost" aria-label="Clear date">
          <svg lucideX></svg>
        </button>
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
class Example {}

export { Example }
