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
  createCalendarController,
} from "@ui-sdk/angular/calendar"
import { addDays, endOfMonth, startOfMonth } from "@ui-sdk/core/date"

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
    <div data-slot="stack">
      <div data-slot="controls">
        @for (preset of presets; track preset.label) {
          <button type="button" data-size="sm" (click)="show(preset.range)">
            {{ preset.label }}
          </button>
        }
      </div>
      <div
        uiCalendar
        mode="range"
        [controller]="calendar"
        [today]="today"
        defaultMonth="2026-10"
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
  readonly today = "2026-10-16"

  readonly presets = [
    { label: "Last 7 Days", range: [addDays(this.today, -6), this.today] },
    {
      label: "This Month",
      range: [startOfMonth(this.today), endOfMonth(this.today)],
    },
    { label: "Next 30 Days", range: [this.today, addDays(this.today, 29)] },
  ] as const

  readonly calendar = createCalendarController()

  show(range: readonly [string, string]) {
    this.calendar.setValue([...range])
    this.calendar.focus(range[0])
  }
}

export { Example }
