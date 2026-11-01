<script lang="ts">
  import { Field, FieldControl, FieldDescription, FieldLabel } from "@ui-sdk/svelte/field"
</script>

<Field>
  <FieldLabel>Feedback</FieldLabel>
  <FieldControl rows="4" name="feedback" placeholder="Your feedback helps us improve.">
    {#snippet render({ props })}
      <textarea {...props}></textarea>
    {/snippet}
  </FieldControl>
  <FieldDescription>Share your thoughts about our service.</FieldDescription>
</Field>
