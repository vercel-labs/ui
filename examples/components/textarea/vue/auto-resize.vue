<script setup lang="ts">
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/vue/field"
import { Textarea } from "@ui-sdk/vue/textarea"
</script>

<template>
  <Field name="notes">
    <FieldLabel>Notes</FieldLabel>
    <Textarea auto-resize placeholder="Type a few lines…" />
    <FieldDescription>Grows as you type, then scrolls.</FieldDescription>
  </Field>
</template>
