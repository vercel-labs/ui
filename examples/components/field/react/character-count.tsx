import { Field, FieldControl, FieldDescription, FieldLabel } from "@ui-sdk/react/field"
import * as React from "react"

const limit = 280

export function Example() {
  const [bio, setBio] = React.useState(
    "Designer and engineer. I build tools for people who make things on the web.",
  )

  return (
    <Field>
      <FieldLabel>Bio</FieldLabel>
      <FieldControl
        render={<textarea rows={4} />}
        name="bio"
        maxLength={limit}
        value={bio}
        onChange={(event) => setBio(event.currentTarget.value)}
      />
      <FieldDescription
        render={(props) => (
          <p {...props}>
            <span>Shown on your public profile.</span>
            <span>
              {bio.length} / {limit}
            </span>
          </p>
        )}
      />
    </Field>
  )
}
