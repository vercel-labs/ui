<script lang="ts">
  import { Field, FieldControl, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/svelte/field"

  let email = $state("ada@example.com")
  let serverError: string | null = $state(null)
  let pending = $state(false)
  let status = $state("")

  function register(email: string) {
    return new Promise<string | null>((resolve) =>
      setTimeout(() => resolve(email === "ada@example.com" ? "This email is already registered." : null), 400),
    )
  }

  async function submit(event: SubmitEvent) {
    event.preventDefault()
    const email = String(new FormData(event.currentTarget as HTMLFormElement).get("email"))
    pending = true
    const message = await register(email)
    pending = false
    serverError = message
    status = message ? "" : `Account created for ${email}.`
  }

  function edit(event: Event) {
    email = (event.target as HTMLInputElement).value
    serverError = null
  }
</script>

<form data-slot="stack" onsubmit={submit}>
  <Field name="email" invalid={serverError !== null || undefined}>
    <FieldLabel>Email</FieldLabel>
    <FieldControl type="email" readonly={pending} required value={email} oninput={edit} />
    <FieldDescription>We'll email you a sign-in link.</FieldDescription>
    <div>
      <FieldError match="valueMissing">Enter your email address.</FieldError>
      <FieldError match="typeMismatch">
        Enter an email address like m@example.com.
      </FieldError>
      <FieldError match>{serverError}</FieldError>
    </div>
  </Field>
  <button type="submit" disabled={pending}>
    {pending ? "Creating…" : "Create account"}
  </button>
  <output data-slot="output">{status}</output>
</form>
