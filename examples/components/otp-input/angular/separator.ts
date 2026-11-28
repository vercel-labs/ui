import { Component } from "@angular/core"
import { LucideMinus } from "@lucide/angular"
import {
  OTPInput,
  OTPInputGroup,
  OTPInputSeparator,
  OTPInputSlot,
} from "@ui-sdk/angular/otp-input"

@Component({
  imports: [
    OTPInput,
    OTPInputGroup,
    OTPInputSeparator,
    OTPInputSlot,
    LucideMinus,
  ],
  template: `
    <div uiOTPInput [maxLength]="6" aria-label="Verification code">
      <div uiOTPInputGroup>
        <div uiOTPInputSlot [index]="0"></div>
        <div uiOTPInputSlot [index]="1"></div>
      </div>
      <div uiOTPInputSeparator>
        <svg lucideMinus></svg>
      </div>
      <div uiOTPInputGroup>
        <div uiOTPInputSlot [index]="2"></div>
        <div uiOTPInputSlot [index]="3"></div>
      </div>
      <div uiOTPInputSeparator>
        <svg lucideMinus></svg>
      </div>
      <div uiOTPInputGroup>
        <div uiOTPInputSlot [index]="4"></div>
        <div uiOTPInputSlot [index]="5"></div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
