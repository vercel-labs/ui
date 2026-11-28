import { Component, signal } from "@angular/core"
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
      mode="range"
      defaultMonth="2026-10"
      [dismissible]="value() !== null"
      (valueChange)="asking.set(false)"
      (beforeOpenChange)="$event.value && asking.set(false)"
      (dismissAttempt)="asking.set(true)"
    >
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
        @if (asking()) {
          <p data-slot="hint" role="alert">
            Pick a check-out date to finish your stay.
          </p>
        }
      </div>
    </div>
  `,
})
class Example {
  readonly value = signal<DatePickerValue>(null)

  readonly asking = signal(false)
}

export { Example }
