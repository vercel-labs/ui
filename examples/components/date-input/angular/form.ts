import { Component } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import { DateInput } from "@ui-sdk/angular/date-input"
import { Field, FieldError, FieldLabel } from "@ui-sdk/angular/field"
import { TimeInput } from "@ui-sdk/angular/time-input"

@Component({
  imports: [DateInput, Field, FieldError, FieldLabel, TimeInput],
  template: `
    <form data-slot="stack" (submit)="onSubmit($event)">
      <div uiField>
        <label uiFieldLabel>Date</label>
        <div uiDateInput name="date" defaultValue="2026-11-02" required></div>
        <div *uiFieldError></div>
      </div>
      <div uiField>
        <label uiFieldLabel>Time</label>
        <div uiTimeInput name="time" defaultValue="09:30" required></div>
        <div *uiFieldError></div>
      </div>
      <div data-slot="row">
        <button type="reset">Reset</button>
        <button type="submit" data-variant="solid">Book</button>
      </div>
    </form>
  `,
})
class Example {
  readonly log = useLog()

  onSubmit(event: SubmitEvent) {
    event.preventDefault()
    const data = [...new FormData(event.currentTarget as HTMLFormElement)].map(
      ([name, value]) => `${name}=${value}`
    )
    this.log(`Submitted ${data.join(", ")}`)
  }
}

export { Example }
