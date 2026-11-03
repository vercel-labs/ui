<script lang="ts">
  import { Field, FieldDescription, FieldLabel } from "@ui-sdk/svelte/field"
  import { Textarea } from "@ui-sdk/svelte/textarea"
</script>

<Field name="message">
  <FieldLabel>Message</FieldLabel>
  <Textarea placeholder="Type your message here." />
  <FieldDescription>Your message will be copied to the support team.</FieldDescription>
</Field>
