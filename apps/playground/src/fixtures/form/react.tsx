import { Field, FieldDescription, FieldError, FieldLabel, FieldLegend, FieldSet } from "@ui-sdk/react/field"
import { Input, InputClear, InputGroup } from "@ui-sdk/react/input"
import { Textarea } from "@ui-sdk/react/textarea"
import * as React from "react"
import { createRoot } from "react-dom/client"
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
  const [errors, setErrors] = React.useState<FormErrors | undefined>(options.errors)
  const [action, setAction] = React.useState("")
  const [submitted, setSubmitted] = React.useState("")
  const [username, setUsername] = React.useState("")
  const [contactDisabled, setContactDisabled] = React.useState(false)
  const pending = React.useRef(false)
  // The server's message for a field, or the browser's own.
  const error = (name: string) => (state: { message: string }) => messageOf(errors, name) || state.message

  return (
    <div className="fixture">
      <button>Before</button>
      <form
        className="form"
        aria-label={f.formLabel}
        onSubmit={async (event) => {
          event.preventDefault()
          if (pending.current) return
          const data = new FormData(event.currentTarget)
          pending.current = true
          try {
            const result = await save(data, options.action)
            setErrors(result)
            if (!result) setSubmitted(serializeData(data))
          } catch {
            // The fake server failed. The page keeps what it showed.
          } finally {
            pending.current = false
          }
        }}
        onReset={() => setErrors(undefined)}
      >
        <FieldSet className="form" disabled={options.disabled || undefined}>
          <FieldLegend>{f.profile.legend}</FieldLegend>
          <FieldDescription>{f.profile.description}</FieldDescription>
          <Field name={f.username.name} invalid={invalidOf(errors, f.username.name)}>
            <FieldLabel className="label">{f.username.label}</FieldLabel>
            <Input
              className="input"
              required
              minLength={3}
              {...(options.controlled && { value: username })}
              onValueChange={(value, details) => {
                if (options.noDigits && /\d/.test(value)) return details.cancel()
                setAction(`${f.username.name}:${value}:${details.reason}`)
                setUsername(value)
                setErrors((current) => without(current, f.username.name))
              }}
            />
            <FieldDescription>{f.username.description}</FieldDescription>
            <FieldError className="field-error">{error(f.username.name)}</FieldError>
          </Field>
          <Field name={f.bio.name} invalid={invalidOf(errors, f.bio.name)}>
            <FieldLabel className="label">{f.bio.label}</FieldLabel>
            <Textarea className="textarea" autoResize submitShortcut={options.submitShortcut} />
            <FieldDescription>{f.bio.description}</FieldDescription>
            <FieldError className="field-error">{error(f.bio.name)}</FieldError>
          </Field>
        </FieldSet>
        <FieldSet className="form" disabled={contactDisabled || undefined}>
          <FieldLegend>{f.contact.legend}</FieldLegend>
          <Field name={f.email.name} invalid={invalidOf(errors, f.email.name)}>
            <FieldLabel className="label">{f.email.label}</FieldLabel>
            <Input
              className="input"
              type="email"
              defaultValue={f.email.defaultValue}
              onValueChange={() => setErrors((current) => without(current, f.email.name))}
            />
            <FieldError className="field-error">{error(f.email.name)}</FieldError>
          </Field>
          <Field name={f.website.name}>
            <FieldLabel className="label">{f.website.label}</FieldLabel>
            <InputGroup className="input-group">
              <span>{f.website.prefix}</span>
              <Input
                className="input"
                onValueChange={(value, details) => setAction(`${f.website.name}:${value}:${details.reason}`)}
              />
              <InputClear aria-label={f.website.clear}>×</InputClear>
            </InputGroup>
          </Field>
        </FieldSet>
        <div className="row">
          <button type="submit">Save</button>
          <button type="reset">Reset</button>
        </div>
      </form>
      <button type="button" onClick={() => setContactDisabled((value) => !value)}>
        Toggle contact
      </button>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
      <output role="status" aria-label="Submitted">
        {submitted}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>,
  )
}

export { Fixture, mount }
