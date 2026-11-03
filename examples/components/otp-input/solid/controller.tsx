import { createOTPInputController, OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/solid/otp-input"
import { createSignal, For } from "solid-js"

export function Example() {
  const code = createOTPInputController()
  const [reading, setReading] = createSignal("")

  return (
    <div data-slot="stack">
      <OTPInput controller={code} aria-label="Verification code">
        <OTPInputGroup>
          <For each={[0, 1, 2, 3, 4, 5]}>{(index) => <OTPInputSlot index={index} />}</For>
        </OTPInputGroup>
      </OTPInput>
      <div data-slot="row">
        <button
          type="button"

          onClick={() => code.setValue("123456")}
        >
          Fill
        </button>
        <button
          type="button"

          onClick={() => code.clear()}
        >
          Clear
        </button>
        <button
          type="button"

          onClick={() => setReading(`The code is "${code.getValue()}".`)}
        >
          Read
        </button>
        <button
          type="button"

          onClick={() => code.focus()}
        >
          Focus
        </button>
      </div>
      <output data-slot="output">{reading()}</output>
    </div>
  )
}
