import { Field, FieldControl, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/solid/field"
import { createSignal, Show } from "solid-js"

function register(email: string) {
  return new Promise<string | null>((resolve) =>
    setTimeout(() => resolve(email === "ada@example.com" ? "This email is already registered." : null), 400),
  )
}

export function Example() {
  const [serverError, setServerError] = createSignal<string | null>(null)
  const [pending, setPending] = createSignal(false)
  const [status, setStatus] = createSignal("")

  return (
    <form
      data-slot="stack"
      onSubmit={async (event) => {
        event.preventDefault()
        const email = String(new FormData(event.currentTarget).get("email"))
        setPending(true)
        const message = await register(email)
        setPending(false)
        setServerError(message)
        setStatus(message ? "" : `Account created for ${email}.`)
      }}
    >
      <Field name="email" invalid={serverError() !== null || undefined}>
        <FieldLabel>Email</FieldLabel>
        <FieldControl
          type="email"
          readonly={pending()}
          required
          defaultValue="ada@example.com"
          onInput={() => setServerError(null)}
        />
        <FieldDescription>We'll email you a sign-in link.</FieldDescription>
        <div>
          <FieldError match="valueMissing">Enter your email address.</FieldError>
          <FieldError match="typeMismatch">Enter an email address like m@example.com.</FieldError>
          <Show when={serverError()}>
            <FieldError match>{serverError()}</FieldError>
          </Show>
        </div>
      </Field>
      <button type="submit" disabled={pending()}>
        {pending() ? "Creating…" : "Create account"}
      </button>
      <output data-slot="output">{status()}</output>
    </form>
  )
}
