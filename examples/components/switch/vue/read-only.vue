<script setup lang="ts">
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/vue/field"
import { Switch, SwitchThumb } from "@ui-sdk/vue/switch"
</script>

<template>
  <Field>
    <div data-slot="stack">
      <FieldLabel>Encrypt backups</FieldLabel>
      <FieldDescription>Managed by your organization.</FieldDescription>
    </div>
    <Switch default-checked read-only>
      <SwitchThumb />
    </Switch>
  </Field>
</template>
