<script setup lang="ts">
import { Eye, EyeOff, Lock } from "@lucide/vue"
import { Field, FieldLabel } from "@ui-sdk/vue/field"
import { PasswordInput, PasswordInputControl, PasswordInputToggle } from "@ui-sdk/vue/password-input"
</script>

<template>
  <Field name="password">
    <FieldLabel>Password</FieldLabel>
    <PasswordInput v-slot="{ state }">
      <PasswordInputControl />
      <span><Lock aria-hidden="true" v-if="state.capsLock" /></span>
      <PasswordInputToggle v-slot="{ state: toggle }" aria-label="Show password">
        <EyeOff aria-hidden="true" v-if="toggle.visible" />
        <Eye aria-hidden="true" v-else />
      </PasswordInputToggle>
    </PasswordInput>
    <p data-slot="caps-lock">Caps Lock is on.</p>
  </Field>
</template>
