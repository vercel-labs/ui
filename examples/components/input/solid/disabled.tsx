import { Field, FieldLabel } from "@ui-sdk/solid/field"
import { Input } from "@ui-sdk/solid/input"

export function Example() {
  return (
    <Field disabled>
      <FieldLabel>Email</FieldLabel>
      <Input type="email" defaultValue="ada@example.com" />
    </Field>
  )
}
