import { Field, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/react/field"
import { OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/react/otp-input"
import * as React from "react"

export function Example() {
  const [submitted, setSubmitted] = React.useState("")

  return (
    <div data-slot="stack">
      <form
        id="verify"
        data-slot="stack"
        onSubmit={(event) => {
          event.preventDefault()
          const data = [...new FormData(event.currentTarget)].map(([name, value]) => `${name}=${value}`)
          setSubmitted(data.join(", "))
        }}
        onReset={() => setSubmitted("")}
      >
        <Field>
          <FieldLabel>Verification code</FieldLabel>
          <OTPInput name="code" required autoComplete="one-time-code">
            <OTPInputGroup>
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <OTPInputSlot key={index} index={index} />
              ))}
            </OTPInputGroup>
          </OTPInput>
          <FieldDescription>Enter the six-digit code from your message.</FieldDescription>
          <div>
            <FieldError />
          </div>
        </Field>
        <div data-slot="row">
          <button type="submit">Verify</button>
          <button type="reset">Reset</button>
        </div>
      </form>
      <Field>
        <FieldLabel>Recovery code (optional)</FieldLabel>
        <OTPInput name="recovery" form="verify" maxLength={8} pattern="alphanumeric">
          <OTPInputGroup>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
              <OTPInputSlot key={index} index={index} />
            ))}
          </OTPInputGroup>
        </OTPInput>
      </Field>
      <output data-slot="output">{submitted ? `Submitted: ${submitted}` : ""}</output>
    </div>
  )
}
