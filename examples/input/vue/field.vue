<script setup lang="ts">
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/vue/field"
import { Input } from "@ui-sdk/vue/input"
</script>

<template>
  <Field name="username">
    <FieldLabel> Username </FieldLabel>
    <Input placeholder="ada" autocomplete="username" />
    <FieldDescription> Choose a unique username for your account. </FieldDescription>
  </Field>
</template>
