<script setup lang="ts">
import { Field, FieldControl, FieldDescription, FieldLabel } from "@ui-sdk/vue/field"
</script>

<template>
  <div data-slot="stack">
    <Field>
      <FieldLabel>Username</FieldLabel>
      <FieldControl name="username" placeholder="hollis" autocomplete="username" />
      <FieldDescription>Choose a unique username for your account.</FieldDescription>
    </Field>
  </div>
</template>
