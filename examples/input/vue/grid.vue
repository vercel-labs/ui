<script setup lang="ts">
import { Field, FieldLabel } from "@ui-sdk/vue/field"
import { Input } from "@ui-sdk/vue/input"
</script>

<template>
  <div data-slot="grid">
    <Field name="first-name">
      <FieldLabel> First name </FieldLabel>
      <Input autocomplete="given-name" placeholder="Ada" />
    </Field>
    <Field name="last-name">
      <FieldLabel> Last name </FieldLabel>
      <Input autocomplete="family-name" placeholder="Lovelace" />
    </Field>
  </div>
</template>
