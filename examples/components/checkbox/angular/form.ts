import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import { Checkbox, CheckboxIndicator } from "@ui-sdk/angular/checkbox"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/angular/field"

@Component({
  imports: [
    Checkbox,
    CheckboxIndicator,
    Field,
    FieldDescription,
    FieldLabel,
    LucideCheck,
  ],
  template: `
    <form data-slot="stack" (submit)="onSubmit($event)">
      <div uiField>
        <button uiCheckbox name="terms" value="yes" required>
          <span uiCheckboxIndicator>
            <svg lucideCheck></svg>
          </span>
        </button>
        <div data-slot="stack">
          <label uiFieldLabel>Accept terms and conditions</label>
          <p uiFieldDescription>
            You agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
      <div uiField>
        <button uiCheckbox name="newsletter" value="weekly" defaultChecked>
          <span uiCheckboxIndicator>
            <svg lucideCheck></svg>
          </span>
        </button>
        <div data-slot="stack">
          <label uiFieldLabel>Send me the weekly newsletter</label>
          <p uiFieldDescription>
            Product news and tips, once a week. Unsubscribe anytime.
          </p>
        </div>
      </div>
      <div data-slot="row">
        <button type="submit">Create Account</button>
        <button type="reset">Reset</button>
      </div>
    </form>
  `,
})
class Example {
  readonly log = useLog()

  onSubmit(event: SubmitEvent) {
    event.preventDefault()
    const entries = [
      ...new FormData(event.currentTarget as HTMLFormElement),
    ].map(([name, value]) => `${name}=${value}`)
    this.log(
      entries.length ? `Submitted ${entries.join("&")}` : "Submitted nothing"
    )
  }
}

export { Example }
