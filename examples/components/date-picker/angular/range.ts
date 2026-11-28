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
    DatePickerTrigger,
    LucideCalendar,
    LucideChevronLeft,
    LucideChevronRight,
  ],
  template: `
    <div
      uiDatePicker
      mode="range"
      [months]="2"
      monthFormat="short"
      [defaultValue]="['2026-10-12', '2026-10-16']"
    >
      <div data-slot="row" #field>
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
      <div *uiDatePickerContent="{ anchor: field, align: 'center' }">
        <div data-slot="row">
          <button uiCalendarPrevious data-variant="ghost">
            <svg lucideChevronLeft></svg>
          </button>
          <h2 uiCalendarHeading></h2>
          <button uiCalendarNext data-variant="ghost">
            <svg lucideChevronRight></svg>
          </button>
        </div>
        <div data-slot="row">
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
          <table uiCalendarGrid [offset]="1">
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
    </div>
  `,
})
class Example {}

export { Example }
