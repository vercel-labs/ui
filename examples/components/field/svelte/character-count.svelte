<script lang="ts">
  import { Field, FieldControl, FieldDescription, FieldLabel } from "@ui-sdk/svelte/field"

  const limit = 280
  let bio = $state("Designer and engineer. I build tools for people who make things on the web.")

  function onInput(event: Event) {
    bio = (event.target as HTMLTextAreaElement).value
  }
</script>

<Field>
  <FieldLabel>Bio</FieldLabel>
  <FieldControl rows="4" name="bio" maxlength={limit} value={bio} oninput={onInput}>
    {#snippet render({ props })}
      <textarea {...props}></textarea>
    {/snippet}
  </FieldControl>
  <FieldDescription>
    {#snippet children()}
      <span>Shown on your public profile.</span>
      <span>
        {bio.length} / {limit}
      </span>
    {/snippet}
  </FieldDescription>
</Field>
