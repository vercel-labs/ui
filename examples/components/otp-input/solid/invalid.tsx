import { OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/solid/otp-input"
import { For } from "solid-js"

export function Example() {
  return (
    <div data-slot="stack">
      <OTPInput
        defaultValue="000000"
        aria-label="Verification code"
        aria-invalid="true"
        aria-describedby="otp-error"
      >
        <OTPInputGroup>
          <For each={[0, 1, 2, 3, 4, 5]}>{(index) => <OTPInputSlot index={index} />}</For>
        </OTPInputGroup>
      </OTPInput>
      <p id="otp-error">That code didn't work. Check it and try again.</p>
    </div>
  )
}
