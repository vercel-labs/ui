import { Component } from "@angular/core"
import {
  LucideCalendar,
  LucideChevronLeft,
  LucideChevronRight,
} from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
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
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@ui-sdk/angular/field"

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
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
    LucideCalendar,
    LucideChevronLeft,
    LucideChevronRight,
  ],
  template: `
    <form data-slot="stack" (submit)="submit($event)">
      <div uiField name="due">
        <label uiFieldLabel>Due date</label>
        <div uiDatePicker required>
          <div data-slot="row">
            <input uiDatePickerInput />
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
          </div>
        </div>
        <p uiFieldDescription>When the invoice is due.</p>
        <div>
          <div *uiFieldError="'valueMissing'">Choose a due date.</div>
        </div>
      </div>
      <button type="submit">Submit</button>
    </form>
  `,
})
class Example {
  readonly log = useLog()

  submit(event: SubmitEvent) {
    event.preventDefault()
    this.log(
      `Submitted due=${new FormData(event.currentTarget as HTMLFormElement).get("due")}`
    )
  }
}

export { Example }
