import { Component } from "@angular/core"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@ui-sdk/angular/field"
import { Input } from "@ui-sdk/angular/input"
import { useLog } from "../../../shared/angular/log"

@Component({
  imports: [Field, FieldDescription, FieldError, FieldLabel, Input],
  template: `
    <form data-slot="stack" (submit)="submit($event)">
      <div uiField #email="uiField" name="email">
        <label uiFieldLabel>Email</label>
        <input uiInput type="email" required placeholder="hollis@example.com" />
        <p uiFieldDescription>
          {{
            email.state().valid
              ? "Looks good."
              : "We'll send you a confirmation link."
          }}
        </p>
        <div uiFieldError match="valueMissing">Enter your email address.</div>
        <div uiFieldError match="typeMismatch">
          Enter an email address like hollis@example.com.
        </div>
      </div>
      <div uiField name="website">
        <label uiFieldLabel>Website</label>
        <input uiInput type="url" required placeholder="https://example.com" />
        <div uiFieldError></div>
      </div>
      <button type="submit" data-variant="solid">Subscribe</button>
    </form>
  `,
})
class Example {
  readonly log = useLog()

  submit(event: SubmitEvent) {
    event.preventDefault()
    const data = new FormData(event.currentTarget as HTMLFormElement)
    this.log(`Subscribed ${data.get("email")}`)
  }
}

export { Example }
