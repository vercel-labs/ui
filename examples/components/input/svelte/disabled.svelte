<script lang="ts">
  import { Field, FieldLabel } from "@ui-sdk/svelte/field"
  import { Input } from "@ui-sdk/svelte/input"
</script>

<Field disabled>
  <FieldLabel>
    Email
  </FieldLabel>
  <Input type="email" defaultValue="ada@example.com" />
</Field>
