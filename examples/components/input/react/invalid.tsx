import { Field, FieldError, FieldLabel } from "@ui-sdk/react/field"
import { Input } from "@ui-sdk/react/input"

export function Example() {
  return (
    <Field invalid>
      <FieldLabel>Email</FieldLabel>
      <Input type="email" defaultValue="ada@example" />
      <FieldError match>Enter an email address like ada@example.com.</FieldError>
    </Field>
  )
}
