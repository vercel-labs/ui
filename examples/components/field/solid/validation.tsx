import { Field, FieldControl, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/solid/field"
import { createSignal } from "solid-js"

export function Example() {
  const [status, setStatus] = createSignal("")

  return (
    <form
      data-slot="stack"
      onSubmit={(event) => {
        event.preventDefault()
        setStatus(`Subscribed ${new FormData(event.currentTarget).get("email")}.`)
      }}
    >
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <FieldControl type="email" required placeholder="m@example.com" />
        <FieldDescription
          render={(props, state) => (
            <p {...props}>{state.valid ? "Looks good." : "We'll send you a confirmation link."}</p>
          )}
        />
        <div>
          <FieldError match="valueMissing">Enter your email address.</FieldError>
          <FieldError match="typeMismatch">Enter an email address like m@example.com.</FieldError>
        </div>
      </Field>
      <Field name="website">
        <FieldLabel>Website</FieldLabel>
        <FieldControl type="url" required placeholder="https://example.com" />
        <div>
          <FieldError render={(props, state) => <p {...props}>{state.message}</p>} />
        </div>
      </Field>
      <button type="submit">Subscribe</button>
      <output data-slot="output">{status()}</output>
    </form>
  )
}
