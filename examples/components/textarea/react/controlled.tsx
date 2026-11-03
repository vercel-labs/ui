import { Field, FieldDescription, FieldLabel } from "@ui-sdk/react/field"
import { Textarea } from "@ui-sdk/react/textarea"
import * as React from "react"

export function Example() {
  const [bio, setBio] = React.useState("")
  return (
    <Field name="bio">
      <FieldLabel>Bio</FieldLabel>
      <Textarea value={bio} onValueChange={setBio} maxLength={160} required />
      <FieldDescription>{bio.length} / 160</FieldDescription>
    </Field>
  )
}
