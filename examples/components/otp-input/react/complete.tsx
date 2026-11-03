import { OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/react/otp-input"
import * as React from "react"

export function Example() {
  const [status, setStatus] = React.useState("")

  return (
    <div data-slot="stack">
      <OTPInput
        aria-label="Verification code"
        onValueChange={() => setStatus("")}
        onComplete={(value, details) => setStatus(`Checking ${value}, from ${details.reason}.`)}
      >
        <OTPInputGroup>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <OTPInputSlot key={index} index={index} />
          ))}
        </OTPInputGroup>
      </OTPInput>
      <output data-slot="output">{status}</output>
    </div>
  )
}
