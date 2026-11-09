import {
  createPasswordInputController,
  PasswordInput,
  PasswordInputControl,
  PasswordInputToggle,
} from "@ui-sdk/react/password-input"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/react/field"
import * as React from "react"
import { createRoot } from "react-dom/client"
import {
  passwordInputAction,
  passwordInputFixture,
  passwordInputOptions,
} from "tests/fixtures/password-input.ts"

const reveal = createPasswordInputController()

function Fixture() {
  const { controlled, cancel, ...options } = passwordInputOptions()
  const [action, setAction] = React.useState("")
  const [visible, setVisible] = React.useState(!!options.defaultVisible)
  const { form, email, password } = passwordInputFixture
  return (
    <div className="fixture">
      <button>Before</button>
      <form
        aria-label={form.label}
        className="password-form"
        onSubmit={(event) => {
          event.preventDefault()
          const field = event.currentTarget.elements.namedItem(
            password.name
          ) as HTMLInputElement
          setAction(passwordInputAction.submit(field.type))
        }}
      >
        <fieldset>
          <legend>{form.account}</legend>
          <label>
            {email.label}{" "}
            <input
              className="input"
              name={email.name}
              defaultValue={email.defaultValue}
            />
          </label>
          <Field>
            <FieldLabel>{password.label}</FieldLabel>
            <PasswordInput
              className="password-input"
              name={password.name}
              controller={reveal}
              {...options}
              {...(controlled && { visible, defaultVisible: undefined })}
              onVisibleChange={(next, details) => {
                if (cancel) {
                  return details.cancel()
                }
                setVisible(next)
                setAction(passwordInputAction.visible(next, details.reason))
              }}
            >
              <PasswordInputControl className="input" />
              <PasswordInputToggle
                className="password-toggle"
                aria-label={password.toggle}
              >
                <span aria-hidden="true">👁</span>
              </PasswordInputToggle>
            </PasswordInput>
            <FieldDescription>{password.description}</FieldDescription>
          </Field>
          <p className="caps-lock">{password.capsLock}</p>
        </fieldset>
        <button type="submit">{form.submit}</button>
        <button type="reset">{form.reset}</button>
      </form>
      <button onClick={() => reveal.toggleVisible()}>
        {passwordInputFixture.controller}
      </button>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>
  )
}

export { Fixture, mount }
