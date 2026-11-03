import { OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/react/otp-input"
import * as React from "react"

export function Example() {
  const [value, setValue] = React.useState("")

  return (
    <div data-slot="stack">
      <label htmlFor="one-time-password" data-slot="label">
        One-time password
      </label>
      <OTPInput id="one-time-password" value={value} onValueChange={setValue}>
        <OTPInputGroup>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <OTPInputSlot key={index} index={index} />
          ))}
        </OTPInputGroup>
      </OTPInput>
      <p data-slot="output">{value ? `You entered: ${value}` : "Enter your one-time password."}</p>
    </div>
  )
}
