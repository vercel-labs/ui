<script lang="ts">
  import { Eye, EyeOff } from "@lucide/svelte"
  import { Field, FieldDescription, FieldLabel } from "@ui-sdk/svelte/field"
  import { PasswordInput, PasswordInputControl, PasswordInputToggle } from "@ui-sdk/svelte/password-input"
</script>

<Field name="recovery-key">
  <FieldLabel>Recovery key</FieldLabel>
  <PasswordInput readOnly defaultValue="7Hq2-vX9p-Lm4c" autoComplete="off">
    <PasswordInputControl />
    <PasswordInputToggle aria-label="Show password">
      {#snippet children(state)}
        {#if state.visible}
          <EyeOff aria-hidden="true" />
        {:else}
          <Eye aria-hidden="true" />
        {/if}
      {/snippet}
    </PasswordInputToggle>
  </PasswordInput>
  <FieldDescription>
    Keep it somewhere safe. You can show it, but not change it.
  </FieldDescription>
</Field>
