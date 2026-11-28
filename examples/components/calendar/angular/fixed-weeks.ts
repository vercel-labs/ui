import { Component } from "@angular/core"
import { LucideChevronLeft, LucideChevronRight } from "@lucide/angular"
import {
  Calendar,
  CalendarDay,
  CalendarGrid,
  CalendarHeading,
  CalendarNext,
  CalendarPrevious,
  CalendarWeekday,
  CalendarWeekdays,
  CalendarWeeks,
} from "@ui-sdk/angular/calendar"

@Component({
  imports: [
    Calendar,
    CalendarDay,
    CalendarGrid,
    CalendarHeading,
    CalendarNext,
    CalendarPrevious,
    CalendarWeekday,
    CalendarWeekdays,
    CalendarWeeks,
    LucideChevronLeft,
    LucideChevronRight,
  ],
  template: `
    <div uiCalendar fixedWeeks [showOutsideDays]="false" defaultMonth="2026-02">
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
  `,
})
class Example {}

export { Example }
