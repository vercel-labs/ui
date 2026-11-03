import { Field, FieldDescription, FieldLabel } from "@ui-sdk/react/field"
import { Input } from "@ui-sdk/react/input"

export function Example() {
  return (
    <Field name="username">
      <FieldLabel>Username</FieldLabel>
      <Input placeholder="ada" autoComplete="username" />
      <FieldDescription>Choose a unique username for your account.</FieldDescription>
    </Field>
  )
}
