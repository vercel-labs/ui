import { Component } from "@angular/core"
import { LucideMinus } from "@lucide/angular"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import {
  OTPInput,
  OTPInputGroup,
  OTPInputSeparator,
  OTPInputSlot,
} from "@ui-sdk/angular/otp-input"

@Component({
  imports: [
    Field,
    FieldLabel,
    OTPInput,
    OTPInputGroup,
    OTPInputSeparator,
    OTPInputSlot,
    LucideMinus,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Recovery code</label>
      <div uiOTPInput [maxLength]="8" pattern="alphanumeric">
        <div uiOTPInputGroup>
          @for (index of [0, 1, 2, 3]; track index) {
            <div uiOTPInputSlot [index]="index"></div>
          }
        </div>
        <div uiOTPInputSeparator>
          <svg lucideMinus></svg>
        </div>
        <div uiOTPInputGroup>
          @for (index of [4, 5, 6, 7]; track index) {
            <div uiOTPInputSlot [index]="index"></div>
          }
        </div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
