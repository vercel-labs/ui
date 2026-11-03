import { Field, FieldDescription, FieldLabel } from "@ui-sdk/solid/field"
import { Textarea } from "@ui-sdk/solid/textarea"

export function Example() {
  return (
    <Field name="message">
      <FieldLabel>Message</FieldLabel>
      <Textarea placeholder="Type your message here." />
      <FieldDescription>Your message will be copied to the support team.</FieldDescription>
    </Field>
  )
}
