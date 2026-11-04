import { Field, FieldDescription, FieldError, FieldLabel, FieldLegend, FieldSet } from "@ui-sdk/solid/field"
import { Input, InputClear, InputGroup } from "@ui-sdk/solid/input"
import { Textarea } from "@ui-sdk/solid/textarea"
import { render } from "@solidjs/web"
import { createSignal } from "solid-js"
import {
  formFixture as f,
  formOptions,
  invalidOf,
  messageOf,
  save,
  serializeData,
  without,
  type FormErrors,
} from "tests/fixtures/form.ts"

function Fixture() {
  const options = formOptions()
  const [errors, setErrors] = createSignal<FormErrors | undefined>(options.errors)
  const [action, setAction] = createSignal("")
  const [submitted, setSubmitted] = createSignal("")
  const [username, setUsername] = createSignal("")
  const [contactDisabled, setContactDisabled] = createSignal(false)
  let pending = false
  // The server's message for a field, or the browser's own.
  const error = (name: string) => (state: { message: string }) => messageOf(errors(), name) || state.message

  return (
    <div class="fixture">
      <button>Before</button>
      <form
        class="form"
        aria-label={f.formLabel}
        onSubmit={async (event) => {
          event.preventDefault()
          if (pending) return
          const data = new FormData(event.currentTarget)
          pending = true
          try {
            const result = await save(data, options.action)
            setErrors(result)
            if (!result) setSubmitted(serializeData(data))
          } catch {
            // The fake server failed. The page keeps what it showed.
          } finally {
            pending = false
          }
        }}
        onReset={() => setErrors(undefined)}
      >
        <FieldSet class="form" disabled={options.disabled || undefined}>
          <FieldLegend>{f.profile.legend}</FieldLegend>
          <FieldDescription>{f.profile.description}</FieldDescription>
          <Field name={f.username.name} invalid={invalidOf(errors(), f.username.name)}>
            <FieldLabel class="label">{f.username.label}</FieldLabel>
            <Input
              class="input"
              required
              minlength={3}
              value={options.controlled ? username() : undefined}
              onValueChange={(value, details) => {
                if (options.noDigits && /\d/.test(value)) return details.cancel()
                setAction(`${f.username.name}:${value}:${details.reason}`)
                setUsername(value)
                setErrors((current) => without(current, f.username.name))
              }}
            />
            <FieldDescription>{f.username.description}</FieldDescription>
            <FieldError class="field-error">{error(f.username.name)}</FieldError>
          </Field>
          <Field name={f.bio.name} invalid={invalidOf(errors(), f.bio.name)}>
            <FieldLabel class="label">{f.bio.label}</FieldLabel>
            <Textarea class="textarea" autoResize submitShortcut={options.submitShortcut} />
            <FieldDescription>{f.bio.description}</FieldDescription>
            <FieldError class="field-error">{error(f.bio.name)}</FieldError>
          </Field>
        </FieldSet>
        <FieldSet class="form" disabled={contactDisabled() || undefined}>
          <FieldLegend>{f.contact.legend}</FieldLegend>
          <Field name={f.email.name} invalid={invalidOf(errors(), f.email.name)}>
            <FieldLabel class="label">{f.email.label}</FieldLabel>
            <Input
              class="input"
              type="email"
              defaultValue={f.email.defaultValue}
              onValueChange={() => setErrors((current) => without(current, f.email.name))}
            />
            <FieldError class="field-error">{error(f.email.name)}</FieldError>
          </Field>
          <Field name={f.website.name}>
            <FieldLabel class="label">{f.website.label}</FieldLabel>
            <InputGroup class="input-group">
              <span>{f.website.prefix}</span>
              <Input
                class="input"
                onValueChange={(value, details) => setAction(`${f.website.name}:${value}:${details.reason}`)}
              />
              <InputClear aria-label={f.website.clear}>×</InputClear>
            </InputGroup>
          </Field>
        </FieldSet>
        <div class="row">
          <button type="submit">Save</button>
          <button type="reset">Reset</button>
        </div>
      </form>
      <button type="button" onClick={() => setContactDisabled((value) => !value)}>
        Toggle contact
      </button>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
      <output role="status" aria-label="Submitted">
        {submitted()}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
