<script setup lang="ts">
import { Field, FieldLabel } from "@ui-sdk/vue/field"
import { Input } from "@ui-sdk/vue/input"
</script>

<template>
  <Field disabled>
    <FieldLabel> Email </FieldLabel>
    <Input type="email" default-value="ada@example.com" />
  </Field>
</template>
