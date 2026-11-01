<script lang="ts">
  import { Field, FieldDescription, FieldLabel } from "@ui-sdk/svelte/field"
  import { Input } from "@ui-sdk/svelte/input"
</script>

<Field name="username">
  <FieldLabel>
    Username
  </FieldLabel>
  <Input placeholder="ada" autocomplete="username" />
  <FieldDescription>
    Choose a unique username for your account.
  </FieldDescription>
</Field>
