import { Component } from "@angular/core"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import {
  OTPInput,
  OTPInputGroup,
  OTPInputSlot,
} from "@ui-sdk/angular/otp-input"

@Component({
  imports: [Field, FieldLabel, OTPInput, OTPInputGroup, OTPInputSlot],
  template: `
    <div uiField>
      <label uiFieldLabel>PIN</label>
      <div uiOTPInput [maxLength]="4" textAlign="center">
        <div uiOTPInputGroup>
          @for (index of [0, 1, 2, 3]; track index) {
            <div uiOTPInputSlot [index]="index"></div>
          }
        </div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
