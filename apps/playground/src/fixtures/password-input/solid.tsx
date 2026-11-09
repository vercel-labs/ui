import { Field, FieldDescription, FieldLabel } from "@ui-sdk/solid/field"
import {
  createPasswordInputController,
  PasswordInput,
  PasswordInputControl,
  PasswordInputToggle,
} from "@ui-sdk/solid/password-input"
import { render } from "@solidjs/web"
import { createSignal } from "solid-js"
import {
  passwordInputAction,
  passwordInputFixture,
  passwordInputOptions,
} from "tests/fixtures/password-input.ts"

const reveal = createPasswordInputController()

function Fixture() {
  const { controlled, cancel, ...options } = passwordInputOptions()
  const [action, setAction] = createSignal("")
  const [visible, setVisible] = createSignal(!!options.defaultVisible)
  const { form, email, password } = passwordInputFixture
  return (
    <div class="fixture">
      <button>Before</button>
      <form
        aria-label={form.label}
        class="password-form"
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
              class="input"
              name={email.name}
              defaultValue={email.defaultValue}
            />
          </label>
          <Field>
            <FieldLabel>{password.label}</FieldLabel>
            <PasswordInput
              class="password-input"
              name={password.name}
              controller={reveal}
              {...options}
              visible={controlled ? visible() : undefined}
              defaultVisible={controlled ? undefined : options.defaultVisible}
              onVisibleChange={(next, details) => {
                if (cancel) {
                  return details.cancel()
                }
                setVisible(next)
                setAction(passwordInputAction.visible(next, details.reason))
              }}
            >
              <PasswordInputControl class="input" />
              <PasswordInputToggle
                class="password-toggle"
                aria-label={password.toggle}
              >
                <span aria-hidden="true">👁</span>
              </PasswordInputToggle>
            </PasswordInput>
            <FieldDescription>{password.description}</FieldDescription>
          </Field>
          <p class="caps-lock">{password.capsLock}</p>
        </fieldset>
        <button type="submit">{form.submit}</button>
        <button type="reset">{form.reset}</button>
      </form>
      <button onClick={() => reveal.toggleVisible()}>
        {passwordInputFixture.controller}
      </button>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
