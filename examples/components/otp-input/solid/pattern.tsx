import { OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/solid/otp-input"
import { For } from "solid-js"

export function Example() {
  return (
    <OTPInput maxLength={6} pattern={/[0-9A-F]/i} inputMode="text" aria-label="Device code">
      <OTPInputGroup>
        <For each={[0, 1, 2, 3, 4, 5]}>{(index) => <OTPInputSlot index={index} />}</For>
      </OTPInputGroup>
    </OTPInput>
  )
}
