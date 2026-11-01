<script setup lang="ts">
import { Field, FieldError, FieldLabel } from "@ui-sdk/vue/field"
import { Input } from "@ui-sdk/vue/input"
</script>

<template>
  <Field invalid>
    <FieldLabel> Email </FieldLabel>
    <Input type="email" default-value="ada@example" />
    <FieldError match> Enter an email address like ada@example.com. </FieldError>
  </Field>
</template>
