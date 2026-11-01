<script setup lang="ts">
import { Eye, EyeOff } from "@lucide/vue"
import { Field, FieldLabel } from "@ui-sdk/vue/field"
import { PasswordInput, PasswordInputControl, PasswordInputToggle } from "@ui-sdk/vue/password-input"
import { ref } from "vue"

const visible = ref(false)
const reason = ref("")
</script>

<template>
  <div data-slot="stack">
    <Field name="password">
      <FieldLabel>Password</FieldLabel>
      <PasswordInput
        v-model:visible="visible"
        @visible-change="(_visible: boolean, details: { reason: string }) => (reason = details.reason)"
      >
        <PasswordInputControl />
        <PasswordInputToggle v-slot="{ state }" aria-label="Show password">
          <EyeOff aria-hidden="true" v-if="state.visible" />
          <Eye aria-hidden="true" v-else />
        </PasswordInputToggle>
      </PasswordInput>
    </Field>
    <output data-slot="output">
      {{ visible ? "The password is shown" : "The password is hidden" }}{{ reason ? ` (${reason}).` : "." }}
    </output>
  </div>
</template>
