import { OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/solid/otp-input"
import { For } from "solid-js"

export function Example() {
  return (
    <div dir="rtl" data-slot="stack">
      <span id="otp-rtl-label" data-slot="label">
        رمز التحقق
      </span>
      <OTPInput maxLength={6} aria-labelledby="otp-rtl-label">
        <OTPInputGroup>
          <For each={[0, 1, 2, 3, 4, 5]}>{(index) => <OTPInputSlot index={index} />}</For>
        </OTPInputGroup>
      </OTPInput>
    </div>
  )
}
