<script lang="ts">
  import { Field, FieldError, FieldLabel } from "@ui-sdk/svelte/field"
  import { Textarea } from "@ui-sdk/svelte/textarea"
</script>

<Field invalid>
  <FieldLabel>Message</FieldLabel>
  <Textarea defaultValue="hi" />
  <FieldError match>Write at least 20 characters.</FieldError>
</Field>
