<script setup lang="ts">
import { Eye, EyeOff } from "@lucide/vue"
import { Field, FieldLabel } from "@ui-sdk/vue/field"
import { Input, InputGroup } from "@ui-sdk/vue/input"
import { ref } from "vue"

const visible = ref(false)
</script>

<template>
  <Field name="password">
    <FieldLabel> Password </FieldLabel>
    <InputGroup>
      <Input :type="visible ? 'text' : 'password'" autocomplete="current-password" />
      <button type="button" aria-label="Show password" :aria-pressed="visible" @click="visible = !visible">
        <EyeOff v-if="visible" />
        <Eye v-else />
      </button>
    </InputGroup>
  </Field>
</template>
