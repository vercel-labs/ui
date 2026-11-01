import { Field, FieldLabel } from "@ui-sdk/react/field"
import {
  createPasswordInputController,
  PasswordInput,
  PasswordInputControl,
  PasswordInputToggle,
} from "@ui-sdk/react/password-input"
import { Eye, EyeOff } from "lucide-react"
import * as React from "react"

export function Example() {
  const [password] = React.useState(createPasswordInputController)
  const [reading, setReading] = React.useState("")
  return (
    <div data-slot="stack">
      <Field name="new-password">
        <FieldLabel>New password</FieldLabel>
        <PasswordInput controller={password} autoComplete="new-password">
          <PasswordInputControl />
          <PasswordInputToggle aria-label="Show password">
            {(state) => (state.visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />)}
          </PasswordInputToggle>
        </PasswordInput>
      </Field>
      <div data-slot="row">
        <button
          type="button"
          onClick={() => {
            password.setValue("plum-kettle-orbit-42")
            password.setVisible(true)
          }}
        >
          Suggest
        </button>
        <button type="button" onClick={() => password.toggleVisible()}>
          Toggle
        </button>
        <button type="button" onClick={() => password.clear()}>
          Clear
        </button>
        <button
          type="button"
          onClick={() =>
            setReading(
              `${password.getValue().length} characters, ${password.isVisible() ? "shown" : "hidden"}.`,
            )
          }
        >
          Read
        </button>
        <button type="button" onClick={() => password.focus()}>
          Focus
        </button>
      </div>
      <output data-slot="output">{reading}</output>
    </div>
  )
}
