import { Component, signal } from "@angular/core"
import { LucideChevronLeft, LucideChevronRight } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
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
  type CalendarValue,
  type CalendarValueChange,
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
    <div>
      <div
        uiCalendar
        [(value)]="value"
        [(month)]="month"
        (beforeValueChange)="onValueChange($event)"
        (beforeMonthChange)="
          log('Showing ' + $event.value + ' (' + $event.reason + ')')
        "
      >
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

  readonly value = signal<CalendarValue>("2026-10-16")

  readonly month = signal("2026-10")

  onValueChange(change: CalendarValueChange) {
    this.log(`Selected ${String(change.value)} (${change.reason})`)
  }
}

export { Example }
