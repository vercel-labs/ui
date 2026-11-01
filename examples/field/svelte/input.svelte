<script lang="ts">
  import { Field, FieldControl, FieldDescription, FieldLabel } from "@ui-sdk/svelte/field"
</script>

<div data-slot="stack">
  <Field>
    <FieldLabel>Username</FieldLabel>
    <FieldControl name="username" placeholder="ada" autocomplete="username" />
    <FieldDescription>
      Choose a unique username for your account.
    </FieldDescription>
  </Field>
</div>
