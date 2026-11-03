<script lang="ts">
  import { Field, FieldDescription, FieldLabel } from "@ui-sdk/svelte/field"
  import { Textarea } from "@ui-sdk/svelte/textarea"
</script>

<Field name="notes">
  <FieldLabel>Notes</FieldLabel>
  <Textarea autoResize placeholder="Type a few lines…" />
  <FieldDescription>Grows as you type, then scrolls.</FieldDescription>
</Field>
