import { Component } from "@angular/core"
import { LucideChevronLeft, LucideChevronRight } from "@lucide/angular"
import {
  Calendar,
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
} from "@ui-sdk/angular/calendar"

@Component({
  imports: [
    Calendar,
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
    LucideChevronLeft,
    LucideChevronRight,
  ],
  template: `
    <div uiCalendar defaultMonth="1990-06" min="1920-01-01" max="2026-10-16">
      <div data-slot="row">
        <button uiCalendarPrevious data-variant="ghost">
          <svg lucideChevronLeft></svg>
        </button>
        <h2 uiCalendarHeading></h2>
        <div data-slot="row">
          <select uiCalendarMonthSelect></select>
          <select uiCalendarYearSelect></select>
        </div>
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
  `,
})
class Example {}

export { Example }
