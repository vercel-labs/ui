import { Field, FieldLabel } from "@ui-sdk/react/field"
import { Input } from "@ui-sdk/react/input"

export function Example() {
  return (
    <div data-slot="grid">
      <Field name="first-name">
        <FieldLabel>First name</FieldLabel>
        <Input autoComplete="given-name" placeholder="Ada" />
      </Field>
      <Field name="last-name">
        <FieldLabel>Last name</FieldLabel>
        <Input autoComplete="family-name" placeholder="Lovelace" />
      </Field>
    </div>
  )
}
