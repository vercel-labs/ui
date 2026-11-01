import { Field, FieldLabel } from "@ui-sdk/react/field"
import { PasswordInput, PasswordInputControl, PasswordInputToggle } from "@ui-sdk/react/password-input"
import { Eye, EyeOff } from "lucide-react"

export function Example() {
  return (
    <Field name="password">
      <FieldLabel>Password</FieldLabel>
      <PasswordInput>
        <PasswordInputControl />
        <PasswordInputToggle
          aria-label="Show password"
          render={(props, state) => <button {...props}>{state.visible ? <EyeOff /> : <Eye />}</button>}
        />
      </PasswordInput>
    </Field>
  )
}
