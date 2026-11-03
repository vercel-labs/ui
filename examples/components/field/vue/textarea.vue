<script setup lang="ts">
import { Field, FieldControl, FieldDescription, FieldLabel } from "@ui-sdk/vue/field"
</script>

<template>
  <Field>
    <FieldLabel>Feedback</FieldLabel>
    <FieldControl rows="4" name="feedback" placeholder="Your feedback helps us improve.">
      <template #render="{ props }">
        <textarea v-bind="props" />
      </template>
    </FieldControl>
    <FieldDescription>Share your thoughts about our service.</FieldDescription>
  </Field>
</template>
