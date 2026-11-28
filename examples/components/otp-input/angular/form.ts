import { Component } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@ui-sdk/angular/field"
import {
  OTPInput,
  OTPInputGroup,
  OTPInputSlot,
} from "@ui-sdk/angular/otp-input"

@Component({
  imports: [
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
    OTPInput,
    OTPInputGroup,
    OTPInputSlot,
  ],
  template: `
    <div data-slot="stack">
      <form id="verify-sign-in" (submit)="onSubmit($event)">
        <div uiField>
          <label uiFieldLabel>Verification code</label>
          <div uiOTPInput name="code" required>
            <div uiOTPInputGroup>
              @for (index of [0, 1, 2, 3, 4, 5]; track index) {
                <div uiOTPInputSlot [index]="index"></div>
              }
            </div>
          </div>
          <p uiFieldDescription>
            Enter the six-digit code we sent to hollis@example.com.
          </p>
          <div *uiFieldError></div>
        </div>
      </form>
      <div uiField>
        <label uiFieldLabel>Recovery code (optional)</label>
        <div
          uiOTPInput
          name="recovery"
          form="verify-sign-in"
          [maxLength]="8"
          pattern="alphanumeric"
        >
          <div uiOTPInputGroup>
            @for (index of [0, 1, 2, 3, 4, 5, 6, 7]; track index) {
              <div uiOTPInputSlot [index]="index"></div>
            }
          </div>
        </div>
        <div *uiFieldError></div>
      </div>
      <div data-slot="row">
        <button type="reset" form="verify-sign-in">Reset</button>
        <button type="submit" form="verify-sign-in" data-variant="solid">
          Verify
        </button>
      </div>
    </div>
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
