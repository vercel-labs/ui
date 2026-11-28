import { Component, signal } from "@angular/core"
import { Field, FieldError, FieldLabel } from "@ui-sdk/angular/field"
import {
  OTPInput,
  OTPInputGroup,
  OTPInputSlot,
} from "@ui-sdk/angular/otp-input"

@Component({
  imports: [
    Field,
    FieldError,
    FieldLabel,
    OTPInput,
    OTPInputGroup,
    OTPInputSlot,
  ],
  template: `
    <div uiField [invalid]="invalid()">
      <label uiFieldLabel>Verification code</label>
      <div uiOTPInput defaultValue="482913" (valueChange)="invalid.set(false)">
        <div uiOTPInputGroup>
          @for (index of [0, 1, 2, 3, 4, 5]; track index) {
            <div uiOTPInputSlot [index]="index"></div>
          }
        </div>
      </div>
      <div *uiFieldError>That code has expired. Request a new one.</div>
    </div>
  `,
})
class Example {
  readonly invalid = signal(true)
}

export { Example }
