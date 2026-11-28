import { Component } from "@angular/core"
import {
  OTPInput,
  OTPInputGroup,
  OTPInputSlot,
} from "@ui-sdk/angular/otp-input"

@Component({
  imports: [OTPInput, OTPInputGroup, OTPInputSlot],
  template: `
    <div
      uiOTPInput
      #oTPInput="uiOTPInput"
      [maxLength]="5"
      aria-label="Invite code"
    >
      <div uiOTPInputGroup>
        @for (_ of oTPInput.state().slots; track index; let index = $index) {
          <span uiOTPInputSlot #oTPInputSlot="uiOTPInputSlot" [index]="index">
            @if (oTPInputSlot.state().char) {
              {{ oTPInputSlot.state().char }}
            } @else if (oTPInputSlot.state().hasFakeCaret) {
              <span></span>
            }
          </span>
        }
      </div>
    </div>
  `,
})
class Example {}

export { Example }
