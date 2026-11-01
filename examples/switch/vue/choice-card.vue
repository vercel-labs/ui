<script setup lang="ts">
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/vue/field"
import { Switch, SwitchThumb } from "@ui-sdk/vue/switch"

const options = [
  {
    label: "Share across devices",
    description: "Focus is shared across devices, and turns off when you leave the app.",
    defaultChecked: false,
  },
  {
    label: "Enable notifications",
    description: "Receive notifications when focus mode is enabled or disabled.",
    defaultChecked: true,
  },
]
</script>

<template>
  <div data-slot="stack">
    <Field v-for="option in options" :key="option.label" data-variant="card">
      <div data-slot="stack">
        <FieldLabel>
          {{ option.label }}
        </FieldLabel>
        <FieldDescription>{{ option.description }}</FieldDescription>
      </div>
      <Switch :default-checked="option.defaultChecked">
        <SwitchThumb />
      </Switch>
    </Field>
  </div>
</template>
