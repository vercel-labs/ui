<script setup lang="ts">
import { EyeIcon, EyeOffIcon } from "@lucide/vue"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/vue/field"
import { PasswordInput, PasswordInputControl, PasswordInputToggle } from "@ui-sdk/vue/password-input"
</script>

<template>
  <Field name="wifi-password">
    <FieldLabel>Wi-Fi password</FieldLabel>
    <PasswordInput default-visible default-value="maple-orbit-42" auto-complete="new-password">
      <PasswordInputControl />
      <PasswordInputToggle v-slot="{ state }" aria-label="Show password">
        <EyeOffIcon aria-hidden="true" v-if="state.visible" />
        <EyeIcon aria-hidden="true" v-else />
      </PasswordInputToggle>
    </PasswordInput>
    <FieldDescription> Guests read it from here, so it starts shown. </FieldDescription>
  </Field>
</template>
