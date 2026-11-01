<script setup lang="ts">
import { Check } from "@lucide/vue"
import { Checkbox, CheckboxIndicator } from "@ui-sdk/vue/checkbox"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/vue/field"

const options = [
  { name: "backups", title: "Daily backups", description: "Keep a copy of every database each night." },
  { name: "alerts", title: "Usage alerts", description: "Email the team when usage passes its limit." },
]
</script>

<template>
  <div data-slot="stack">
    <FieldLabel v-for="option in options" :key="option.name" data-variant="card">
      <Field>
        <Checkbox :name="option.name">
          <CheckboxIndicator>
            <Check />
          </CheckboxIndicator>
        </Checkbox>
        <span data-slot="stack">
          <span>{{ option.title }}</span>
          <FieldDescription>{{ option.description }}</FieldDescription>
        </span>
      </Field>
    </FieldLabel>
  </div>
</template>
