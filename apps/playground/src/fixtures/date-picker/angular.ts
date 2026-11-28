import { Component } from "@angular/core"
import {
  CalendarGrid,
  CalendarHeading,
  CalendarNext,
  CalendarPrevious,
  DatePicker,
  DatePickerClear,
  DatePickerContent,
  DatePickerHint,
  DatePickerInput,
  type DatePickerOpenChange,
  DatePickerPreset,
  DatePickerTrigger,
  type DatePickerValueChange,
} from "@ui-sdk/angular/date-picker"
import {
  datePickerAction,
  datePickerFixture,
  datePickerOptions,
} from "../../../../../tests/fixtures/date-picker"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    CalendarGrid,
    CalendarHeading,
    CalendarNext,
    CalendarPrevious,
    DatePicker,
    DatePickerClear,
    DatePickerContent,
    DatePickerHint,
    DatePickerInput,
    DatePickerPreset,
    DatePickerTrigger,
  ],
  template: `
    <div class="fixture" [attr.lang]="options.lang">
      <button>Before</button>
      <form (submit)="onSubmit($event)">
        <label for="date-start">{{ range ? "Stay" : "Due date" }}</label>
        <div
          uiDatePicker
          class="date-picker"
          [today]="f.today"
          [name]="range ? undefined : f.name"
          [startName]="range ? 'start' : undefined"
          [endName]="range ? 'end' : undefined"
          [mode]="options.mode"
          [defaultValue]="options.defaultValue"
          [min]="options.min"
          [max]="options.max"
          [unavailable]="options.unavailable"
          [required]="options.required"
          [disabled]="options.disabled"
          [readOnly]="options.readOnly"
          [closeOnSelect]="options.closeOnSelect"
          [minDays]="options.minDays"
          [maxDays]="options.maxDays"
          [container]="options.container"
          (beforeValueChange)="onValueChange($event)"
          (beforeOpenChange)="onOpenChange($event)"
        >
          <input
            uiDatePickerInput
            id="date-start"
            [attr.aria-label]="range ? 'Start date' : null"
          />
          @if (range) {
            <input uiDatePickerInput end aria-label="End date" />
          }
          <button uiDatePickerTrigger></button>
          <button *uiDatePickerClear>Clear</button>
          <span uiDatePickerHint class="date-picker-hint"></span>
          <div *uiDatePickerContent class="date-picker-content">
            <div class="calendar-header">
              <button uiCalendarPrevious class="calendar-step"></button>
              <h2 uiCalendarHeading class="calendar-heading"></h2>
              <button uiCalendarNext class="calendar-step"></button>
            </div>
            <table uiCalendarGrid class="calendar-grid"></table>
            <button uiDatePickerPreset [value]="preset.value">
              {{ preset.label }}
            </button>
          </div>
        </div>
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </form>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output role="status" aria-label="Submitted">{{ submitted() }}</output>
    </div>
  `,
})
class Fixture {
  readonly f = datePickerFixture
  readonly options: ReturnType<typeof datePickerOptions> & {
    container?: HTMLElement | null
  } = datePickerOptions()
  readonly range = this.options.mode === "range"
  readonly preset: { label: string; value: string | [string, string] } = this
    .range
    ? {
        label: datePickerFixture.rangePreset.label,
        value: datePickerFixture.rangePreset.value as [string, string],
      }
    : datePickerFixture.preset
  readonly action = state("")
  readonly submitted = state("")

  onValueChange(change: DatePickerValueChange) {
    this.action.set(datePickerAction("value", change.value, change.reason))
  }

  onOpenChange(change: DatePickerOpenChange) {
    this.action.set(datePickerAction("open", change.value, change.reason))
  }

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
