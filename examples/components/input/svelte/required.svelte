<script lang="ts">
  import { Field, FieldError, FieldLabel } from "@ui-sdk/svelte/field"
  import { Input } from "@ui-sdk/svelte/input"
</script>

<form data-slot="stack" onsubmit={(event) => event.preventDefault()}>
  <Field name="email">
    <FieldLabel>
      Email
    </FieldLabel>
    <Input type="email" required />
    <FieldError />
  </Field>
  <button type="submit">
    Continue
  </button>
</form>
