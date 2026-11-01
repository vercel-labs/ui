<script setup lang="ts">
import { Field, FieldLabel } from "@ui-sdk/vue/field"
import { Input, InputGroup } from "@ui-sdk/vue/input"
</script>

<template>
  <div data-slot="stack">
    <Field name="website">
      <FieldLabel> Website </FieldLabel>
      <InputGroup>
        <span>https://</span>
        <Input placeholder="example" />
        <span>.com</span>
      </InputGroup>
    </Field>
  </div>
</template>
