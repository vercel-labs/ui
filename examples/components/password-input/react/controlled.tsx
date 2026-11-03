import { Field, FieldLabel } from "@ui-sdk/react/field"
import { PasswordInput, PasswordInputControl, PasswordInputToggle } from "@ui-sdk/react/password-input"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import * as React from "react"

export function Example() {
  const [visible, setVisible] = React.useState(false)
  const [reason, setReason] = React.useState("")
  return (
    <div data-slot="stack">
      <Field name="password">
        <FieldLabel>Password</FieldLabel>
        <PasswordInput
          visible={visible}
          onVisibleChange={(next, details) => {
            setVisible(next)
            setReason(details.reason)
          }}
        >
          <PasswordInputControl />
          <PasswordInputToggle aria-label="Show password">
            {(state) => (state.visible ? <EyeOffIcon aria-hidden="true" /> : <EyeIcon aria-hidden="true" />)}
          </PasswordInputToggle>
        </PasswordInput>
      </Field>
      <output data-slot="output">
        {visible ? "The password is shown" : "The password is hidden"}
        {reason ? ` (${reason}).` : "."}
      </output>
    </div>
  )
}
