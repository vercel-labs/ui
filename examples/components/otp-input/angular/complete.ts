import { Component } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
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
      <label uiFieldLabel>Verification code</label>
      <div
        uiOTPInput
        (valueCommit)="
          log('Checking ' + $event.value + ' (' + $event.reason + ')')
        "
      >
        <div uiOTPInputGroup>
          @for (index of [0, 1, 2, 3, 4, 5]; track index) {
            <div uiOTPInputSlot [index]="index"></div>
          }
        </div>
      </div>
    </div>
  `,
})
class Example {
  readonly log = useLog()
}

export { Example }
