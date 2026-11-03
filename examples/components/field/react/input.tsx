import { Field, FieldControl, FieldDescription, FieldLabel } from "@ui-sdk/react/field"

function Example() {
  return (
    <div data-slot="stack">
      <Field>
        <FieldLabel>Username</FieldLabel>
        <FieldControl name="username" placeholder="hollis" autoComplete="username" />
        <FieldDescription>Choose a unique username for your account.</FieldDescription>
      </Field>
    </div>
  )
}

export { Example }
