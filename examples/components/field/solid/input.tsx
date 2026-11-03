import { Field, FieldControl, FieldDescription, FieldLabel } from "@ui-sdk/solid/field"

export function Example() {
  return (
    <div data-slot="stack">
      <Field>
        <FieldLabel>Username</FieldLabel>
        <FieldControl name="username" placeholder="ada" autocomplete="username" />
        <FieldDescription>Choose a unique username for your account.</FieldDescription>
      </Field>
    </div>
  )
}
