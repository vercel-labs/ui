<script lang="ts">
  import { Field, FieldControl, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/svelte/field"

  let status = $state("")

  function submit(event: SubmitEvent) {
    event.preventDefault()
    status = `Subscribed ${new FormData(event.currentTarget as HTMLFormElement).get("email")}.`
  }
</script>

<form data-slot="stack" onsubmit={submit}>
  <Field name="email">
    <FieldLabel>Email</FieldLabel>
    <FieldControl type="email" required placeholder="m@example.com" />
    <FieldDescription>
      {#snippet children(state)}
        {state.valid ? "Looks good." : "We'll send you a confirmation link."}
      {/snippet}
    </FieldDescription>
    <div>
      <FieldError match="valueMissing">Enter your email address.</FieldError>
      <FieldError match="typeMismatch">
        Enter an email address like m@example.com.
      </FieldError>
    </div>
  </Field>
  <Field name="website">
    <FieldLabel>Website</FieldLabel>
    <FieldControl type="url" required placeholder="https://example.com" />
    <div>
      <FieldError>
        {#snippet children(state)}{state.message}{/snippet}
      </FieldError>
    </div>
  </Field>
  <button type="submit">
    Subscribe
  </button>
  <output data-slot="output">{status}</output>
</form>
