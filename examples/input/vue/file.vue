<script setup lang="ts">
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/vue/field"
import { Input } from "@ui-sdk/vue/input"
</script>

<template>
  <Field name="avatar">
    <FieldLabel> Picture </FieldLabel>
    <Input type="file" accept="image/*" />
    <FieldDescription>PNG or JPG, up to 2 MB.</FieldDescription>
  </Field>
</template>
