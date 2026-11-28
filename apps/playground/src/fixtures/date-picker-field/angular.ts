import { Component } from "@angular/core"
import {
  CalendarGrid,
  CalendarHeading,
  CalendarNext,
  CalendarPrevious,
  DatePicker,
  DatePickerContent,
  DatePickerHint,
  DatePickerInput,
  DatePickerTrigger,
} from "@ui-sdk/angular/date-picker"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@ui-sdk/angular/field"
import {
  datePickerFieldFixture,
  datePickerFieldOptions,
  datePickerFixture,
} from "../../../../../tests/fixtures/date-picker"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    CalendarGrid,
    CalendarHeading,
    CalendarNext,
    CalendarPrevious,
    DatePicker,
    DatePickerContent,
    DatePickerHint,
    DatePickerInput,
    DatePickerTrigger,
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <form (submit)="onSubmit($event)">
        <div
          uiField
          class="field"
          [name]="picker.name"
          [disabled]="options.disabled"
        >
          <label uiFieldLabel>{{ f.label }}</label>
          @if (shown()) {
            <div
              uiDatePicker
              class="date-picker"
              [today]="picker.today"
              [required]="options.required"
            >
              <input uiDatePickerInput />
              <button uiDatePickerTrigger></button>
              <span uiDatePickerHint class="date-picker-hint"></span>
              <div *uiDatePickerContent class="date-picker-content">
                <div>
                  <button uiCalendarPrevious></button>
                  <h2 uiCalendarHeading></h2>
                  <button uiCalendarNext></button>
                </div>
                <table uiCalendarGrid></table>
              </div>
            </div>
          }
          <p uiFieldDescription>{{ f.description }}</p>
          <div *uiFieldError class="field-error"></div>
        </div>
        <button type="submit">Submit</button>
        <button type="button" (click)="shown.set(false)">
          Remove date picker
        </button>
      </form>
      <output role="status" aria-label="Submitted">{{ submitted() }}</output>
    </div>
  `,
})
class Fixture {
  readonly f = datePickerFieldFixture
  readonly picker = datePickerFixture
  readonly options = datePickerFieldOptions()
  readonly submitted = state("")
  readonly shown = state(true)

  onSubmit(event: SubmitEvent) {
    event.preventDefault()
    const form = event.currentTarget as HTMLFormElement
    this.submitted.set(JSON.stringify([...new FormData(form)]))
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
