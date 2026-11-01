<script lang="ts">
  import { Field, FieldDescription, FieldLabel } from "@ui-sdk/svelte/field"
  import { Input } from "@ui-sdk/svelte/input"
</script>

<Field name="avatar">
  <FieldLabel>
    Picture
  </FieldLabel>
  <Input type="file" accept="image/*" />
  <FieldDescription>PNG or JPG, up to 2 MB.</FieldDescription>
</Field>
