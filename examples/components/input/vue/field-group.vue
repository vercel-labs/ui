<script setup lang="ts">
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/vue/field"
import { Input } from "@ui-sdk/vue/input"
</script>

<template>
  <div data-slot="stack">
    <Field name="name">
      <FieldLabel> Name </FieldLabel>
      <Input placeholder="Ada Lovelace" autocomplete="name" />
    </Field>
    <Field name="email">
      <FieldLabel> Email </FieldLabel>
      <Input type="email" placeholder="ada@example.com" autocomplete="email" />
      <FieldDescription>We'll never share your email.</FieldDescription>
    </Field>
    <Field name="password">
      <FieldLabel> Password </FieldLabel>
      <Input type="password" autocomplete="new-password" />
      <FieldDescription>At least 8 characters.</FieldDescription>
    </Field>
  </div>
</template>
