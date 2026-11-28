import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  Checkbox,
  CheckboxGroup,
  CheckboxIndicator,
} from "@ui-sdk/angular/checkbox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@ui-sdk/angular/field"

@Component({
  imports: [
    Checkbox,
    CheckboxGroup,
    CheckboxIndicator,
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
    LucideCheck,
  ],
  template: `
    <form data-slot="stack" (submit)="onSubmit($event)">
      <div uiField>
        <label uiFieldLabel>Notifications</label>
        <p uiFieldDescription>Choose how we tell you about your orders.</p>
        <div uiCheckboxGroup name="notifications" required>
          @for (channel of channels; track channel.value) {
            <label data-slot="label">
              <button uiCheckbox [value]="channel.value">
                <span uiCheckboxIndicator>
                  <svg lucideCheck></svg>
                </span>
              </button>
              {{ channel.label }}
            </label>
          }
        </div>
        <div>
          <div *uiFieldError>Choose at least one way to be notified.</div>
        </div>
      </div>
      <button type="submit">Save</button>
    </form>
  `,
})
class Example {
  readonly channels = [
    { value: "email", label: "Email" },
    { value: "sms", label: "SMS" },
    { value: "push", label: "Push notifications" },
  ]

  readonly log = useLog()

  onSubmit(event: SubmitEvent) {
    event.preventDefault()
    const entries = [
      ...new FormData(event.currentTarget as HTMLFormElement),
    ].map(([name, value]) => `${name}=${value}`)
    this.log(`Saved ${entries.join("&")}`)
  }
}

export { Example }
