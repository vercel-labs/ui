<script setup lang="ts">
import { Minus, Plus } from "@lucide/vue"
import { Field, FieldLabel } from "@ui-sdk/vue/field"
import {
  NumberInput,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
  NumberInputControl,
} from "@ui-sdk/vue/number-input"

const fields = [
  {
    label: "Price",
    defaultValue: 19.99,
    step: 0.01,
    format: { style: "currency", currency: "USD" },
  },
  { label: "Discount", defaultValue: 0.15, step: 0.01, format: { style: "percent" } },
  { label: "Weight", defaultValue: 2.5, step: 0.1, format: { style: "unit", unit: "kilogram" } },
] satisfies { label: string; defaultValue: number; step: number; format: Intl.NumberFormatOptions }[]
</script>

<template>
  <div data-slot="stack">
    <Field v-for="field in fields" :key="field.label">
      <FieldLabel>{{ field.label }}</FieldLabel>
      <NumberInput :default-value="field.defaultValue" :step="field.step" :format="field.format" :min="0">
        <NumberInputGroup>
          <NumberInputDecrement aria-label="Decrease">
            <Minus aria-hidden="true" />
          </NumberInputDecrement>
          <NumberInputControl />
          <NumberInputIncrement aria-label="Increase">
            <Plus aria-hidden="true" />
          </NumberInputIncrement>
        </NumberInputGroup>
      </NumberInput>
    </Field>
  </div>
</template>
