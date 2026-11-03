import { Field, FieldControl, FieldDescription, FieldLabel } from "@ui-sdk/solid/field"
import { createSignal } from "solid-js"

const limit = 280

export function Example() {
  const [bio, setBio] = createSignal(
    "Designer and engineer. I build tools for people who make things on the web.",
  )

  return (
    <Field>
      <FieldLabel>Bio</FieldLabel>
      <FieldControl
        render={(props) => <textarea {...props} rows={4} />}
        name="bio"
        maxlength={limit}
        value={bio()}
        onInput={(event) => setBio(event.currentTarget.value)}
      />
      <FieldDescription
        render={(props) => (
          <p {...props}>
            <span>Shown on your public profile.</span>
            <span>
              {bio().length} / {limit}
            </span>
          </p>
        )}
      />
    </Field>
  )
}
