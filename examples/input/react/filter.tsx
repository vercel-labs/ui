import { Field, FieldDescription, FieldLabel } from "@ui-sdk/react/field"
import { Input } from "@ui-sdk/react/input"

export function Example() {
  return (
    <Field name="code">
      <FieldLabel>Verification code</FieldLabel>
      <Input
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        onValueChange={(value, details) => {
          if (!/^\d*$/.test(value)) details.cancel()
        }}
      />
      <FieldDescription>Six digits from the text we sent.</FieldDescription>
    </Field>
  )
}
