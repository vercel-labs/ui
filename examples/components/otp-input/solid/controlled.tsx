import { OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/solid/otp-input"
import { createSignal, For } from "solid-js"

export function Example() {
  const [value, setValue] = createSignal("")

  return (
    <div data-slot="stack">
      <label for="one-time-password" data-slot="label">
        One-time password
      </label>
      <OTPInput id="one-time-password" value={value()} onValueChange={setValue}>
        <OTPInputGroup>
          <For each={[0, 1, 2, 3, 4, 5]}>{(index) => <OTPInputSlot index={index} />}</For>
        </OTPInputGroup>
      </OTPInput>
      <p data-slot="output">{value() ? `You entered: ${value()}` : "Enter your one-time password."}</p>
    </div>
  )
}
