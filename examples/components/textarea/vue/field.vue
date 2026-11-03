<script setup lang="ts">
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/vue/field"
import { Textarea } from "@ui-sdk/vue/textarea"
</script>

<template>
  <Field name="message">
    <FieldLabel>Message</FieldLabel>
    <Textarea placeholder="Type your message here." />
    <FieldDescription>Your message will be copied to the support team.</FieldDescription>
  </Field>
</template>
