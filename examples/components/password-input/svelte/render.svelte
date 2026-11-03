<script lang="ts">
  import { EyeIcon, EyeOffIcon } from "@lucide/svelte"
  import { Field, FieldLabel } from "@ui-sdk/svelte/field"
  import { PasswordInput, PasswordInputControl, PasswordInputToggle } from "@ui-sdk/svelte/password-input"

</script>

<Field name="password">
  <FieldLabel>Password</FieldLabel>
  <PasswordInput>
    {#snippet render({ props, state })}
      <div {...props}>
        <PasswordInputControl>
          {#snippet render({ props: control, state: field })}
            <input {...control} />
          {/snippet}
        </PasswordInputControl>
        <PasswordInputToggle aria-label="Show password">
          {#snippet render({ props: toggle, state: shown })}
            <button {...toggle}>
              {#if shown.visible}
                <EyeOffIcon />
              {:else}
                <EyeIcon />
              {/if}
            </button>
          {/snippet}
        </PasswordInputToggle>
      </div>
    {/snippet}
  </PasswordInput>
</Field>
