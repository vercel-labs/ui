import { Field, FieldDescription, FieldLabel } from "@ui-sdk/react/field"
import { Input } from "@ui-sdk/react/input"

export function Example() {
  return (
    <div data-slot="stack">
      <Field name="name">
        <FieldLabel>Name</FieldLabel>
        <Input placeholder="Ada Lovelace" autoComplete="name" />
      </Field>
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <Input type="email" placeholder="ada@example.com" autoComplete="email" />
        <FieldDescription>We'll never share your email.</FieldDescription>
      </Field>
      <Field name="password">
        <FieldLabel>Password</FieldLabel>
        <Input type="password" autoComplete="new-password" />
        <FieldDescription>At least 8 characters.</FieldDescription>
      </Field>
    </div>
  )
}
