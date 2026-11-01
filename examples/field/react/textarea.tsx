import { Field, FieldControl, FieldDescription, FieldLabel } from "@ui-sdk/react/field"

export function Example() {
  return (
    <Field>
      <FieldLabel>Feedback</FieldLabel>
      <FieldControl
        render={<textarea rows={4} />}
        name="feedback"
        placeholder="Your feedback helps us improve."
      />
      <FieldDescription>Share your thoughts about our service.</FieldDescription>
    </Field>
  )
}
