import { Component } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@ui-sdk/angular/field"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/angular/radio"

@Component({
  imports: [
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
    Radio,
    RadioGroup,
    RadioIndicator,
  ],
  template: `
    <form data-slot="stack" (submit)="onSubmit($event)">
      <div uiField>
        <label uiFieldLabel>Order updates</label>
        <p uiFieldDescription>Choose how we tell you about your orders.</p>
        <div uiRadioGroup name="updates" required>
          @for (channel of channels; track channel.value) {
            <label data-slot="label">
              <button uiRadio [value]="channel.value">
                <span uiRadioIndicator></span>
              </button>
              {{ channel.label }}
            </label>
          }
        </div>
        <div *uiFieldError>Choose how to get order updates.</div>
      </div>
      <div data-slot="row">
        <button type="submit" data-variant="solid">Save</button>
      </div>
    </form>
  `,
})
class Example {
  readonly channels = [
    { value: "email", label: "Email only" },
    { value: "sms", label: "SMS only" },
    { value: "both", label: "Email and SMS" },
  ]

  readonly log = useLog()

  onSubmit(event: SubmitEvent) {
    event.preventDefault()
    this.log(
      `Saved updates=${new FormData(event.currentTarget as HTMLFormElement).get("updates")}`
    )
  }
}

export { Example }
