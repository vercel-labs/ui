import { Field, FieldDescription, FieldLabel } from "@ui-sdk/solid/field"
import { Input } from "@ui-sdk/solid/input"

export function Example() {
  return (
    <Field name="code">
      <FieldLabel>Verification code</FieldLabel>
      <Input
        inputmode="numeric"
        autocomplete="one-time-code"
        maxlength={6}
        onValueChange={(value, details) => {
          if (!/^\d*$/.test(value)) details.cancel()
        }}
      />
      <FieldDescription>Six digits from the text we sent.</FieldDescription>
    </Field>
  )
}
