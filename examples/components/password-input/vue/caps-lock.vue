<script setup lang="ts">
import { EyeIcon, EyeOffIcon, LockIcon } from "@lucide/vue"
import { Field, FieldLabel } from "@ui-sdk/vue/field"
import { PasswordInput, PasswordInputControl, PasswordInputToggle } from "@ui-sdk/vue/password-input"
</script>

<template>
  <Field name="password">
    <FieldLabel>Password</FieldLabel>
    <PasswordInput v-slot="{ state }">
      <PasswordInputControl />
      <span><LockIcon aria-hidden="true" v-if="state.capsLock" /></span>
      <PasswordInputToggle v-slot="{ state: toggle }" aria-label="Show password">
        <EyeOffIcon aria-hidden="true" v-if="toggle.visible" />
        <EyeIcon aria-hidden="true" v-else />
      </PasswordInputToggle>
    </PasswordInput>
    <p data-slot="caps-lock">Caps Lock is on.</p>
  </Field>
</template>
