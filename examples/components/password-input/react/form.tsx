import { Field, FieldLabel } from "@ui-sdk/react/field"
import { Input } from "@ui-sdk/react/input"
import { PasswordInput, PasswordInputControl, PasswordInputToggle } from "@ui-sdk/react/password-input"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import * as React from "react"

export function Example() {
  const [submitted, setSubmitted] = React.useState("")
  return (
    <div data-slot="stack">
      <form
        data-slot="stack"
        id="sign-in"
        onSubmit={(event) => {
          event.preventDefault()
          const data = new FormData(event.currentTarget)
          const length = String(data.get("password")).length
          setSubmitted(`Signed in as ${data.get("email")}, with a password of ${length} characters.`)
        }}
        onReset={() => setSubmitted("")}
      >
        <Field name="email">
          <FieldLabel>Email</FieldLabel>
          <Input type="email" required autoComplete="username" />
        </Field>
      </form>
      <Field>
        <FieldLabel>Password</FieldLabel>
        <PasswordInput name="password" form="sign-in" required>
          <PasswordInputControl />
          <PasswordInputToggle aria-label="Show password">
            {(state) => (state.visible ? <EyeOffIcon aria-hidden="true" /> : <EyeIcon aria-hidden="true" />)}
          </PasswordInputToggle>
        </PasswordInput>
      </Field>
      <div data-slot="row">
        <button type="submit" form="sign-in">
          Sign in
        </button>
        <button type="reset" form="sign-in">
          Reset
        </button>
      </div>
      <output data-slot="output">{submitted}</output>
    </div>
  )
}
