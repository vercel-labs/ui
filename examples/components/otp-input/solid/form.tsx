import { Field, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/solid/field"
import { OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/solid/otp-input"
import { createSignal, For } from "solid-js"

export function Example() {
  const [submitted, setSubmitted] = createSignal("")

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
              <For each={[0, 1, 2, 3, 4, 5]}>{(index) => <OTPInputSlot index={index} />}</For>
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
            <For each={[0, 1, 2, 3, 4, 5, 6, 7]}>{(index) => <OTPInputSlot index={index} />}</For>
          </OTPInputGroup>
        </OTPInput>
      </Field>
      <output data-slot="output">{submitted() ? `Submitted: ${submitted()}` : ""}</output>
    </div>
  )
}
