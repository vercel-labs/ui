<script lang="ts">
  import { Eye, EyeOff } from "@lucide/svelte"
  import { Field, FieldDescription, FieldLabel } from "@ui-sdk/svelte/field"
  import { PasswordInput, PasswordInputControl, PasswordInputToggle } from "@ui-sdk/svelte/password-input"
</script>

<Field disabled name="password">
  <FieldLabel>Password</FieldLabel>
  <PasswordInput defaultValue="hunter22">
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
    Your administrator manages this password.
  </FieldDescription>
</Field>
