import { Component } from "@angular/core"
import {
  createOTPInputController,
  OTPInput,
  OTPInputGroup,
  OTPInputSeparator,
  OTPInputSlot,
  type OTPInputValueChange,
  type OTPInputValueCommit,
} from "@ui-sdk/angular/otp-input"
import {
  otpInputAction,
  otpInputFixture,
  otpInputOptions,
} from "../../../../../tests/fixtures/otp-input"
import { mountAngular, state } from "../../angular-mount"

const { code, recovery } = otpInputFixture
const slots = (length: number, start = 0) =>
  Array.from({ length }, (_, slot) => start + slot)

@Component({
  imports: [OTPInput, OTPInputGroup, OTPInputSeparator, OTPInputSlot],
  template: `
    <div class="fixture">
      <button>Before</button>
      <form [attr.aria-label]="f.form.label" (submit)="onSubmit($event)">
        <div
          uiOTPInput
          class="otp"
          [aria-label]="f.code.label"
          [name]="f.code.name"
          [maxLength]="f.code.length"
          [controller]="controller"
          [defaultValue]="options.defaultValue"
          [disabled]="options.disabled"
          [required]="options.required"
          (beforeValueChange)="onValueChange($event)"
          (valueCommit)="onValueCommit($event)"
        >
          @for (group of groups; track $index) {
            @if ($index > 0) {
              <div uiOTPInputSeparator class="otp-separator">-</div>
            }
            <div uiOTPInputGroup class="otp-group">
              @for (slot of group; track slot) {
                <div uiOTPInputSlot class="otp-slot" [index]="slot"></div>
              }
            </div>
          }
        </div>
        <button type="submit">{{ f.form.submit }}</button>
        <button type="reset">{{ f.form.reset }}</button>
      </form>
      <div
        uiOTPInput
        class="otp"
        [aria-label]="f.recovery.label"
        [maxLength]="f.recovery.length"
        pattern="alphanumeric"
      >
        <div uiOTPInputGroup class="otp-group">
          @for (slot of recoverySlots; track slot) {
            <div uiOTPInputSlot class="otp-slot" [index]="slot"></div>
          }
        </div>
      </div>
      <button (click)="controller.setValue(f.filled)">Fill code</button>
      <button (click)="controller.clear()">Clear code</button>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output aria-label="Submitted">{{ submitted() }}</output>
    </div>
  `,
})
class Fixture {
  readonly f = otpInputFixture
  readonly controller = createOTPInputController()
  readonly options = otpInputOptions()
  readonly groups = code.groups.map((size, group) =>
    slots(
      size,
      code.groups.slice(0, group).reduce((sum, length) => sum + length, 0)
    )
  )
  readonly recoverySlots = slots(recovery.length)
  readonly action = state("")
  readonly submitted = state("")

  onValueChange(change: OTPInputValueChange) {
    const { cancel } = this.options
    if (cancel && change.value.includes(cancel)) {
      return change.cancel()
    }
    this.action.set(otpInputAction.change(change.value, change.reason))
  }

  onValueCommit(change: OTPInputValueCommit) {
    this.action.set(otpInputAction.complete(change.value))
  }

  onSubmit(event: SubmitEvent) {
    event.preventDefault()
    this.submitted.set(
      String(
        new FormData(event.currentTarget as HTMLFormElement).get(code.name)
      )
    )
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
