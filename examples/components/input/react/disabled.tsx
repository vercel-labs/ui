import { Field, FieldLabel } from "@ui-sdk/react/field"
import { Input } from "@ui-sdk/react/input"

export function Example() {
  return (
    <Field disabled>
      <FieldLabel>Email</FieldLabel>
      <Input type="email" defaultValue="ada@example.com" />
    </Field>
  )
}
