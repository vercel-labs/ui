import { Field, FieldError, FieldLabel } from "@ui-sdk/solid/field"
import { Input } from "@ui-sdk/solid/input"

export function Example() {
  return (
    <Field invalid>
      <FieldLabel>Email</FieldLabel>
      <Input type="email" defaultValue="ada@example" />
      <FieldError match>Enter an email address like ada@example.com.</FieldError>
    </Field>
  )
}
