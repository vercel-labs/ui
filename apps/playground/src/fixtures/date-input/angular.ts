import { Component } from "@angular/core"
import {
  createDateInputController,
  DateInput,
  type DateInputValueChange,
} from "@ui-sdk/angular/date-input"
import { Field, FieldError, FieldLabel } from "@ui-sdk/angular/field"
import {
  TimeInput,
  type TimeInputValueChange,
} from "@ui-sdk/angular/time-input"
import {
  dateInputAction,
  dateInputFixture,
  dateInputOptions,
} from "../../../../../tests/fixtures/date-input"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [DateInput, Field, FieldError, FieldLabel, TimeInput],
  template: `
    <div class="fixture">
      <button>Before</button>
      <form [attr.aria-label]="f.form.label" (submit)="onSubmit($event)">
        <div uiField class="field" [name]="f.date.name">
          <label uiFieldLabel>{{ f.date.label }}</label>
          <div
            uiDateInput
            class="date-input"
            [controller]="controller"
            [defaultValue]="options.date.defaultValue"
            [locale]="options.date.locale"
            [granularity]="options.date.granularity"
            [hourCycle]="options.date.hourCycle"
            [min]="options.date.min"
            [max]="options.date.max"
            [unavailable]="options.date.unavailable"
            [disabled]="options.disabled"
            [readOnly]="options.readOnly"
            [required]="options.required"
            (beforeValueChange)="onDateChange($event)"
          ></div>
          <div *uiFieldError class="field-error"></div>
        </div>
        <div uiField class="field" [name]="f.time.name">
          <label uiFieldLabel>{{ f.time.label }}</label>
          <div
            uiTimeInput
            class="date-input"
            [defaultValue]="options.time.defaultValue"
            [locale]="options.time.locale"
            [hourCycle]="options.time.hourCycle"
            [disabled]="options.disabled"
            [readOnly]="options.readOnly"
            [required]="options.required"
            (beforeValueChange)="onTimeChange($event)"
          ></div>
        </div>
        <button type="submit">{{ f.form.submit }}</button>
        <button type="reset">{{ f.form.reset }}</button>
      </form>
      <button (click)="controller.setValue(f.filled)">Set date</button>
      <button (click)="controller.clear()">Clear date</button>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output aria-label="Submitted">{{ submitted() }}</output>
    </div>
  `,
})
class Fixture {
  readonly f = dateInputFixture
  readonly controller = createDateInputController()
  readonly options = dateInputOptions()
  readonly action = state("")
  readonly submitted = state("")

  onDateChange(change: DateInputValueChange) {
    const { cancel } = this.options
    if (cancel && change.value === cancel) {
      return change.cancel()
    }
    this.action.set(dateInputAction.change("date", change.value, change.reason))
  }

  onTimeChange(change: TimeInputValueChange) {
    this.action.set(dateInputAction.change("time", change.value, change.reason))
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
