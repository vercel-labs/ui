<script lang="ts">
  import { EyeIcon, EyeOffIcon } from "@lucide/svelte"
  import {
    createPasswordInputController,
    PasswordInput,
    PasswordInputControl,
    PasswordInputToggle,
  } from "@ui-sdk/svelte/password-input"
  import { Field, FieldLabel } from "@ui-sdk/svelte/field"

  const password = createPasswordInputController()
  let reading = $state("")

  function suggest() {
    password.setValue("plum-kettle-orbit-42")
    password.setVisible(true)
  }

  function read() {
    reading = `${password.getValue().length} characters, ${password.isVisible() ? "shown" : "hidden"}.`
  }
</script>

<div data-slot="stack">
  <Field name="new-password">
    <FieldLabel>New password</FieldLabel>
    <PasswordInput controller={password} autoComplete="new-password">
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
  <div data-slot="row">
    <button type="button" onclick={suggest}>
      Suggest
    </button>
    <button type="button" onclick={() => (password.toggleVisible())}>
      Toggle
    </button>
    <button type="button" onclick={() => (password.clear())}>
      Clear
    </button>
    <button type="button" onclick={read}>
      Read
    </button>
    <button type="button" onclick={() => (password.focus())}>
      Focus
    </button>
  </div>
  <output data-slot="output">{reading}</output>
</div>
