import { Field, FieldError, FieldLabel } from "@ui-sdk/solid/field"
import { Input } from "@ui-sdk/solid/input"

export function Example() {
  return (
    <form data-slot="stack" onSubmit={(event) => event.preventDefault()}>
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <Input type="email" required />
        <FieldError />
      </Field>
      <button type="submit">Continue</button>
    </form>
  )
}
