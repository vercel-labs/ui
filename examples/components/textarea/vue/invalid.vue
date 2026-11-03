<script setup lang="ts">
import { Field, FieldError, FieldLabel } from "@ui-sdk/vue/field"
import { Textarea } from "@ui-sdk/vue/textarea"
</script>

<template>
  <Field invalid>
    <FieldLabel>Message</FieldLabel>
    <Textarea default-value="hi" />
    <FieldError match>Write at least 20 characters.</FieldError>
  </Field>
</template>
