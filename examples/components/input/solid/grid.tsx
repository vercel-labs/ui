import { Field, FieldLabel } from "@ui-sdk/solid/field"
import { Input } from "@ui-sdk/solid/input"

export function Example() {
  return (
    <div data-slot="grid">
      <Field name="first-name">
        <FieldLabel>First name</FieldLabel>
        <Input autocomplete="given-name" placeholder="Ada" />
      </Field>
      <Field name="last-name">
        <FieldLabel>Last name</FieldLabel>
        <Input autocomplete="family-name" placeholder="Lovelace" />
      </Field>
    </div>
  )
}
