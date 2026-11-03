import { Field, FieldLabel } from "@ui-sdk/solid/field"
import { Textarea } from "@ui-sdk/solid/textarea"

export function Example() {
  return (
    <Field disabled>
      <FieldLabel>Message</FieldLabel>
      <Textarea defaultValue="Replies are closed for this thread." />
    </Field>
  )
}
