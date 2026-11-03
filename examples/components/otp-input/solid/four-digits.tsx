import { OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/solid/otp-input"
import { For } from "solid-js"

export function Example() {
  return (
    <OTPInput maxLength={4} textAlign="center" aria-label="PIN">
      <OTPInputGroup>
        <For each={[0, 1, 2, 3]}>{(index) => <OTPInputSlot index={index} />}</For>
      </OTPInputGroup>
    </OTPInput>
  )
}
