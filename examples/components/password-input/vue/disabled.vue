<script setup lang="ts">
import { EyeIcon, EyeOffIcon } from "@lucide/vue"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/vue/field"
import { PasswordInput, PasswordInputControl, PasswordInputToggle } from "@ui-sdk/vue/password-input"
</script>

<template>
  <Field disabled name="password">
    <FieldLabel>Password</FieldLabel>
    <PasswordInput default-value="hunter22">
      <PasswordInputControl />
      <PasswordInputToggle v-slot="{ state }" aria-label="Show password">
        <EyeOffIcon aria-hidden="true" v-if="state.visible" />
        <EyeIcon aria-hidden="true" v-else />
      </PasswordInputToggle>
    </PasswordInput>
    <FieldDescription> Your administrator manages this password. </FieldDescription>
  </Field>
</template>
