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
    <div uiField dir="rtl">
      <label uiFieldLabel>رمز التحقق</label>
      <div uiOTPInput [maxLength]="6">
        <div uiOTPInputGroup>
          @for (index of [0, 1, 2, 3, 4, 5]; track index) {
            <div uiOTPInputSlot [index]="index"></div>
          }
        </div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
