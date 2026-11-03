<script lang="ts">
  import { EyeIcon, EyeOffIcon } from "@lucide/svelte"
  import { Field, FieldLabel } from "@ui-sdk/svelte/field"
  import { PasswordInput, PasswordInputControl, PasswordInputToggle } from "@ui-sdk/svelte/password-input"

  let visible = $state(false)
  let reason = $state("")
</script>

<div data-slot="stack">
  <Field name="password">
    <FieldLabel>Password</FieldLabel>
    <PasswordInput
      bind:visible={visible}
      onVisibleChange={(_visible: boolean, details: { reason: string }) => (reason = details.reason)}
    >
      <PasswordInputControl />
      <PasswordInputToggle aria-label="Show password">
        {#snippet children(state)}
          {#if state.visible}
            <EyeOffIcon aria-hidden="true" />
          {:else}
            <EyeIcon aria-hidden="true" />
          {/if}
        {/snippet}
      </PasswordInputToggle>
    </PasswordInput>
  </Field>
  <output data-slot="output">
    {visible ? "The password is shown" : "The password is hidden"}{reason ? ` (${reason}).` : "."}
  </output>
</div>
