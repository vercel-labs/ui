<script lang="ts">
  import { Eye, EyeOff } from "@lucide/svelte"
  import { Field, FieldDescription, FieldLabel } from "@ui-sdk/svelte/field"
  import { PasswordInput, PasswordInputControl, PasswordInputToggle } from "@ui-sdk/svelte/password-input"
</script>

<div dir="rtl">
  <Field name="password">
    <FieldLabel>كلمة المرور</FieldLabel>
    <PasswordInput>
      <PasswordInputControl />
      <PasswordInputToggle aria-label="إظهار كلمة المرور">
        {#snippet children(state)}
          {#if state.visible}
            <EyeOff />
          {:else}
            <Eye />
          {/if}
        {/snippet}
      </PasswordInputToggle>
    </PasswordInput>
    <FieldDescription>ثمانية أحرف على الأقل.</FieldDescription>
  </Field>
</div>
