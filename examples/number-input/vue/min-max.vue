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
    <FieldLabel>Guests</FieldLabel>
    <NumberInput :default-value="2" :min="1" :max="8">
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
    <FieldDescription>Between 1 and 8 guests.</FieldDescription>
  </Field>
</template>
