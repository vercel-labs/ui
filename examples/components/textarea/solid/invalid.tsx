import { Field, FieldError, FieldLabel } from "@ui-sdk/solid/field"
import { Textarea } from "@ui-sdk/solid/textarea"

export function Example() {
  return (
    <Field invalid>
      <FieldLabel>Message</FieldLabel>
      <Textarea defaultValue="hi" />
      <FieldError match>Write at least 20 characters.</FieldError>
    </Field>
  )
}
