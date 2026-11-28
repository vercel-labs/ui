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
    <div uiCalendar today="2026-10-16" defaultValue="2026-10-16">
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
            <th
              uiCalendarWeekday
              #calendarWeekday="uiCalendarWeekday"
              [index]="index"
            >
              <abbr
                [title]="calendarWeekday.state().name"
                [attr.data-weekend]="
                  calendarWeekday.state().weekday === 0 ||
                  calendarWeekday.state().weekday === 6 ||
                  null
                "
              >
                {{ calendarWeekday.state().label }}
              </abbr>
            </th>
          </ng-template>
        </thead>
        <tbody uiCalendarWeeks>
          <ng-template let-cell>
            <td uiCalendarDay #calendarDay="uiCalendarDay" [value]="cell.date">
              <span data-slot="stack">
                <span>
                  {{ calendarDay.state().label }}
                </span>
                @if (
                  !calendarDay.state().outside && !calendarDay.state().disabled
                ) {
                  <span data-slot="hint">
                    \${{ priceOf(calendarDay.state().date) }}
                  </span>
                }
              </span>
            </td>
          </ng-template>
        </tbody>
      </table>
    </div>
  `,
})
class Example {
  readonly priceOf = (date: string) =>
    80 + ((Number(date.slice(8)) * 7) % 5) * 10
}

export { Example }
