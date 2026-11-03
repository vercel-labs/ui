import { OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/solid/otp-input"
import { For } from "solid-js"

export function Example() {
  return (
    <div data-slot="stack">
      <OTPInput disabled defaultValue="123456" aria-label="Disabled code">
        <OTPInputGroup>
          <For each={[0, 1, 2, 3, 4, 5]}>{(index) => <OTPInputSlot index={index} />}</For>
        </OTPInputGroup>
      </OTPInput>
      <OTPInput readOnly defaultValue="654321" aria-label="Read-only code">
        <OTPInputGroup>
          <For each={[0, 1, 2, 3, 4, 5]}>{(index) => <OTPInputSlot index={index} />}</For>
        </OTPInputGroup>
      </OTPInput>
    </div>
  )
}
