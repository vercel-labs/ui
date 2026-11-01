<script setup lang="ts">
import { Eye, EyeOff } from "@lucide/vue"
import { Field, FieldLabel } from "@ui-sdk/vue/field"
import { PasswordInput, PasswordInputControl, PasswordInputToggle } from "@ui-sdk/vue/password-input"
</script>

<template>
  <Field name="password">
    <FieldLabel>Password</FieldLabel>
    <PasswordInput>
      <template #render="{ props, state }">
        <div v-bind="props">
          <PasswordInputControl>
            <template #render="{ props: control, state: field }">
              <input v-bind="control" />
            </template>
          </PasswordInputControl>
          <PasswordInputToggle aria-label="Show password">
            <template #render="{ props: toggle, state: shown }">
              <button v-bind="toggle">
                <EyeOff v-if="shown.visible" />
                <Eye v-else />
              </button>
            </template>
          </PasswordInputToggle>
        </div>
      </template>
    </PasswordInput>
  </Field>
</template>
