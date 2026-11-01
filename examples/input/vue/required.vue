<script setup lang="ts">
import { Field, FieldError, FieldLabel } from "@ui-sdk/vue/field"
import { Input } from "@ui-sdk/vue/input"
</script>

<template>
  <form data-slot="stack" @submit.prevent>
    <Field name="email">
      <FieldLabel> Email </FieldLabel>
      <Input type="email" required />
      <FieldError />
    </Field>
    <button type="submit">Continue</button>
  </form>
</template>
