import { Field, FieldLabel } from "@ui-sdk/react/field"
import { PasswordInput, PasswordInputControl, PasswordInputToggle } from "@ui-sdk/react/password-input"
import { Eye, EyeOff, Lock } from "lucide-react"

export function Example() {
  return (
    <Field name="password">
      <FieldLabel>Password</FieldLabel>
      <PasswordInput>
        {(state) => (
          <>
            <PasswordInputControl />
            <span>{state.capsLock && <Lock aria-hidden="true" />}</span>
            <PasswordInputToggle aria-label="Show password">
              {(toggle) => (toggle.visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />)}
            </PasswordInputToggle>
          </>
        )}
      </PasswordInput>
      <p data-slot="caps-lock">Caps Lock is on.</p>
    </Field>
  )
}
