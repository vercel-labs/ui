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
      <label uiFieldLabel>Verification code</label>
      <div uiOTPInput [maxLength]="6">
        <div uiOTPInputGroup>
          <div uiOTPInputSlot [index]="0"></div>
          <div uiOTPInputSlot [index]="1"></div>
          <div uiOTPInputSlot [index]="2"></div>
        </div>
        <div uiOTPInputSeparator>
          <svg lucideMinus></svg>
        </div>
        <div uiOTPInputGroup>
          <div uiOTPInputSlot [index]="3"></div>
          <div uiOTPInputSlot [index]="4"></div>
          <div uiOTPInputSlot [index]="5"></div>
        </div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
