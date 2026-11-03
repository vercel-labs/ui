import { Field, FieldDescription, FieldLabel } from "@ui-sdk/solid/field"
import { Input } from "@ui-sdk/solid/input"

export function Example() {
  return (
    <Field name="username">
      <FieldLabel>Username</FieldLabel>
      <Input placeholder="ada" autocomplete="username" />
      <FieldDescription>Choose a unique username for your account.</FieldDescription>
    </Field>
  )
}
