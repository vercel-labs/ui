<script setup lang="ts">
import { EyeIcon, EyeOffIcon } from "@lucide/vue"
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
        <EyeOffIcon v-if="visible" />
        <EyeIcon v-else />
      </button>
    </InputGroup>
  </Field>
</template>
