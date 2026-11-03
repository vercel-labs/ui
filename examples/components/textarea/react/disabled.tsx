import { Field, FieldLabel } from "@ui-sdk/react/field"
import { Textarea } from "@ui-sdk/react/textarea"

export function Example() {
  return (
    <Field disabled>
      <FieldLabel>Message</FieldLabel>
      <Textarea defaultValue="Replies are closed for this thread." />
    </Field>
  )
}
