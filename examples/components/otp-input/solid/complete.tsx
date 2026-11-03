import { OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/solid/otp-input"
import { createSignal, For } from "solid-js"

export function Example() {
  const [status, setStatus] = createSignal("")

  return (
    <div data-slot="stack">
      <OTPInput
        aria-label="Verification code"
        onValueChange={() => setStatus("")}
        onValueCommit={(value, details) => setStatus(`Checking ${value}, from ${details.reason}.`)}
      >
        <OTPInputGroup>
          <For each={[0, 1, 2, 3, 4, 5]}>{(index) => <OTPInputSlot index={index} />}</For>
        </OTPInputGroup>
      </OTPInput>
      <output data-slot="output">{status()}</output>
    </div>
  )
}
