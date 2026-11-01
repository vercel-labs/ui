<script lang="ts">
  import { Eye, EyeOff } from "@lucide/svelte"
  import { Field, FieldLabel } from "@ui-sdk/svelte/field"
  import { Input, InputGroup } from "@ui-sdk/svelte/input"

  let visible = $state(false)
</script>

<Field name="password">
  <FieldLabel>
    Password
  </FieldLabel>
  <InputGroup>
    <Input type={visible ? 'text' : 'password'} autocomplete="current-password" />
    <button
      type="button"
      aria-label="Show password"
      aria-pressed={visible}
      onclick={() => (visible = !visible)}
    >
      {#if visible}
        <EyeOff />
      {:else}
        <Eye />
      {/if}
    </button>
  </InputGroup>
</Field>
