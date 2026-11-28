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
    LucideChevronLeft,
    LucideChevronRight,
  ],
  template: `
    <div uiCalendar defaultValue="2026-10-16" [weekStartsOn]="1">
      <div data-slot="row">
        <button
          uiCalendarPrevious
          #previous="uiCalendarPrevious"
          data-variant="ghost"
          [title]="'Show ' + previous.state().month"
        >
          <svg lucideChevronLeft></svg>
        </button>
        <h2 uiCalendarHeading #calendarHeading="uiCalendarHeading">
          {{ calendarHeading.state().label }}
        </h2>
        <button uiCalendarNext data-variant="ghost">
          <svg lucideChevronRight></svg>
        </button>
      </div>
      <table uiCalendarGrid #calendarGrid="uiCalendarGrid">
        <thead>
          <tr>
            <th scope="col">
              <abbr title="Week">Wk</abbr>
            </th>
            @for (
              weekday of calendarGrid.state().weekdays;
              track weekday;
              let index = $index
            ) {
              <th uiCalendarWeekday [index]="index"></th>
            }
          </tr>
        </thead>
        <tbody>
          @for (week of calendarGrid.state().weeks; track week[0]!.date) {
            <tr>
              <th scope="row" data-slot="hint">{{ isoWeek(week[0]!.date) }}</th>
              @for (cell of week; track cell.date) {
                @if (cell.hidden) {
                  <td></td>
                } @else {
                  <td uiCalendarDay [value]="cell.date"></td>
                }
              }
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
class Example {
  isoWeek(date: string) {
    const day = new Date(`${date}T00:00:00Z`)
    day.setUTCDate(day.getUTCDate() + 3 - ((day.getUTCDay() + 6) % 7))
    const firstThursday = new Date(Date.UTC(day.getUTCFullYear(), 0, 4))
    const days = (day.getTime() - firstThursday.getTime()) / 86400000
    return (
      1 + Math.round((days - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7)
    )
  }
}

export { Example }
