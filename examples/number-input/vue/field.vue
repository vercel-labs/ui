<script setup lang="ts">
import { Minus, Plus } from "@lucide/vue"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/vue/field"
import {
  NumberInput,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
  NumberInputControl,
} from "@ui-sdk/vue/number-input"
</script>

<template>
  <Field>
    <FieldLabel>Quantity</FieldLabel>
    <NumberInput :default-value="1" :min="1">
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
    <FieldDescription>How many seats to book.</FieldDescription>
  </Field>
</template>
