import { Component } from "@angular/core"
import {
  LucideCalendar,
  LucideChevronLeft,
  LucideChevronRight,
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
  DatePickerContent,
  DatePickerInput,
  DatePickerPreset,
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
    DatePickerContent,
    DatePickerInput,
    DatePickerPreset,
    DatePickerTrigger,
    LucideCalendar,
    LucideChevronLeft,
    LucideChevronRight,
  ],
  template: `
    <div uiDatePicker mode="range" today="2026-10-16">
      <div data-slot="row">
        <input uiDatePickerInput aria-label="Check in" placeholder="Check in" />
        <span data-slot="hint">–</span>
        <input
          uiDatePickerInput
          end
          aria-label="Check out"
          placeholder="Check out"
        />
        <button uiDatePickerTrigger data-variant="ghost">
          <svg lucideCalendar></svg>
        </button>
      </div>
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
        <div data-slot="row">
          <button
            uiDatePickerPreset
            data-variant="ghost"
            [value]="['2026-10-10', '2026-10-16']"
          >
            Last 7 Days
          </button>
          <button
            uiDatePickerPreset
            data-variant="ghost"
            [value]="['2026-09-17', '2026-10-16']"
          >
            Last 30 Days
          </button>
          <button
            uiDatePickerPreset
            data-variant="ghost"
            [value]="['2026-10-01', '2026-10-31']"
          >
            This Month
          </button>
        </div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
