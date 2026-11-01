import { Field, FieldDescription, FieldLabel } from "@ui-sdk/solid/field"
import { Input } from "@ui-sdk/solid/input"

export function Example() {
  return (
    <div data-slot="stack">
      <Field name="name">
        <FieldLabel>Name</FieldLabel>
        <Input placeholder="Ada Lovelace" autocomplete="name" />
      </Field>
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <Input type="email" placeholder="ada@example.com" autocomplete="email" />
        <FieldDescription>We'll never share your email.</FieldDescription>
      </Field>
      <Field name="password">
        <FieldLabel>Password</FieldLabel>
        <Input type="password" autocomplete="new-password" />
        <FieldDescription>At least 8 characters.</FieldDescription>
      </Field>
    </div>
  )
}
