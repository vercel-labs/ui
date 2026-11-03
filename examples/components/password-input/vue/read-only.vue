<script setup lang="ts">
import { EyeIcon, EyeOffIcon } from "@lucide/vue"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/vue/field"
import { PasswordInput, PasswordInputControl, PasswordInputToggle } from "@ui-sdk/vue/password-input"
</script>

<template>
  <Field name="recovery-key">
    <FieldLabel>Recovery key</FieldLabel>
    <PasswordInput read-only default-value="7Hq2-vX9p-Lm4c" auto-complete="off">
      <PasswordInputControl />
      <PasswordInputToggle v-slot="{ state }" aria-label="Show password">
        <EyeOffIcon aria-hidden="true" v-if="state.visible" />
        <EyeIcon aria-hidden="true" v-else />
      </PasswordInputToggle>
    </PasswordInput>
    <FieldDescription> Keep it somewhere safe. You can show it, but not change it. </FieldDescription>
  </Field>
</template>
