<script lang="ts">
  import { Eye, EyeOff, Lock } from "@lucide/svelte"
  import { Field, FieldLabel } from "@ui-sdk/svelte/field"
  import { PasswordInput, PasswordInputControl, PasswordInputToggle } from "@ui-sdk/svelte/password-input"
</script>

<Field name="password">
  <FieldLabel>Password</FieldLabel>
  <PasswordInput>
    {#snippet children(state)}
      <PasswordInputControl />
      <span>{#if state.capsLock}
        <Lock aria-hidden="true" />
      {/if}</span>
      <PasswordInputToggle aria-label="Show password">
        {#snippet children(toggle)}
          {#if toggle.visible}
            <EyeOff aria-hidden="true" />
          {:else}
            <Eye aria-hidden="true" />
          {/if}
        {/snippet}
      </PasswordInputToggle>
    {/snippet}
  </PasswordInput>
  <p data-slot="caps-lock">Caps Lock is on.</p>
</Field>
