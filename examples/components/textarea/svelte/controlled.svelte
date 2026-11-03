<script lang="ts">
  import { Field, FieldDescription, FieldLabel } from "@ui-sdk/svelte/field"
  import { Textarea } from "@ui-sdk/svelte/textarea"

  let bio = $state("")
</script>

<Field name="bio">
  <FieldLabel>Bio</FieldLabel>
  <Textarea bind:value={bio} maxlength={160} required />
  <FieldDescription>{bio.length} / 160</FieldDescription>
</Field>
