import { Field, FieldDescription, FieldLabel } from "@ui-sdk/solid/field"
import { Textarea } from "@ui-sdk/solid/textarea"
import { createSignal } from "solid-js"

export function Example() {
  const [bio, setBio] = createSignal("")
  return (
    <Field name="bio">
      <FieldLabel>Bio</FieldLabel>
      <Textarea value={bio()} onValueChange={setBio} maxlength={160} required />
      <FieldDescription>{bio().length} / 160</FieldDescription>
    </Field>
  )
}
