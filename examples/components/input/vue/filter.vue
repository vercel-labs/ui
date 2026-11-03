<script setup lang="ts">
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/vue/field"
import { Input } from "@ui-sdk/vue/input"
</script>

<template>
  <Field name="code">
    <FieldLabel> Verification code </FieldLabel>
    <Input
      inputmode="numeric"
      autocomplete="one-time-code"
      maxlength="6"
      @value-change="
        (value: string, details: { cancel: () => void }) => {
          if (!/^\d*$/.test(value)) details.cancel()
        }
      "
    />
    <FieldDescription> Six digits from the text we sent. </FieldDescription>
  </Field>
</template>
