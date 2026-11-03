<script lang="ts">
  import { Field, FieldError, FieldLabel } from "@ui-sdk/svelte/field"
  import { Input } from "@ui-sdk/svelte/input"
</script>

<Field invalid>
  <FieldLabel>
    Email
  </FieldLabel>
  <Input type="email" defaultValue="ada@example" />
  <FieldError match>
    Enter an email address like ada@example.com.
  </FieldError>
</Field>
