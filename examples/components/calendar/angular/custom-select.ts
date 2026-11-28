import { Component, computed, signal } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import {
  Calendar,
  CalendarDay,
  CalendarGrid,
  CalendarHeading,
  CalendarWeekday,
  CalendarWeekdays,
  CalendarWeeks,
} from "@ui-sdk/angular/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/angular/select"

@Component({
  imports: [
    Calendar,
    CalendarDay,
    CalendarGrid,
    CalendarHeading,
    CalendarWeekday,
    CalendarWeekdays,
    CalendarWeeks,
    Select,
    SelectContent,
    SelectItem,
    SelectItemIndicator,
    SelectTrigger,
    SelectValue,
    LucideCheck,
    LucideChevronDown,
  ],
  template: `
    <div
      uiCalendar
      [(month)]="month"
      defaultValue="2026-10-16"
      min="2024-01-01"
      max="2028-12-31"
    >
      <div data-slot="row">
        <h2 uiCalendarHeading></h2>
        <ng-container
          uiSelect
          [items]="months"
          [value]="monthOfYear()"
          (beforeValueChange)="
            $event.value && month.set(year() + '-' + $event.value)
          "
        >
          <button uiSelectTrigger aria-label="Month">
            <span uiSelectValue></span>
            <svg lucideChevronDown></svg>
          </button>
          <div *uiSelectContent>
            @for (option of months; track option.value) {
              <div uiSelectItem [value]="option.value">
                {{ option.label }}
                <span *uiSelectItemIndicator>
                  <svg lucideCheck></svg>
                </span>
              </div>
            }
          </div>
        </ng-container>
        <ng-container
          uiSelect
          [items]="years"
          [value]="year()"
          (beforeValueChange)="
            $event.value && month.set($event.value + '-' + monthOfYear())
          "
        >
          <button uiSelectTrigger aria-label="Year">
            <span uiSelectValue></span>
            <svg lucideChevronDown></svg>
          </button>
          <div *uiSelectContent>
            @for (option of years; track option.value) {
              <div uiSelectItem [value]="option.value">
                {{ option.label }}
                <span *uiSelectItemIndicator>
                  <svg lucideCheck></svg>
                </span>
              </div>
            }
          </div>
        </ng-container>
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
class Example {
  readonly months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ].map((label, index) => ({
    value: String(index + 1).padStart(2, "0"),
    label,
  }))

  readonly years = ["2024", "2025", "2026", "2027", "2028"].map((year) => ({
    value: year,
    label: year,
  }))

  readonly month = signal("2026-10")

  readonly year = computed(() => this.month().split("-")[0])

  readonly monthOfYear = computed(() => this.month().split("-")[1])
}

export { Example }
