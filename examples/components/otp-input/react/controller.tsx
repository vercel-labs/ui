import { createOTPInputController, OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/react/otp-input"
import * as React from "react"

export function Example() {
  const [code] = React.useState(createOTPInputController)
  const [reading, setReading] = React.useState("")

  return (
    <div data-slot="stack">
      <OTPInput controller={code} aria-label="Verification code">
        <OTPInputGroup>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <OTPInputSlot key={index} index={index} />
          ))}
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
      <output data-slot="output">{reading}</output>
    </div>
  )
}
