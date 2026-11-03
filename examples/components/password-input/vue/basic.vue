<script setup lang="ts">
import { EyeIcon, EyeOffIcon } from "@lucide/vue"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/vue/field"
import { PasswordInput, PasswordInputControl, PasswordInputToggle } from "@ui-sdk/vue/password-input"
</script>

<template>
  <Field name="password">
    <FieldLabel>Password</FieldLabel>
    <PasswordInput>
      <PasswordInputControl />
      <PasswordInputToggle v-slot="{ state }" aria-label="Show password">
        <EyeOffIcon aria-hidden="true" v-if="state.visible" />
        <EyeIcon aria-hidden="true" v-else />
      </PasswordInputToggle>
    </PasswordInput>
    <FieldDescription>Use at least 8 characters.</FieldDescription>
  </Field>
</template>
