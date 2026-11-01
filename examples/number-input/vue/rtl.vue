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
</script>

<template>
  <div dir="rtl">
    <Field>
      <FieldLabel>الكمية</FieldLabel>
      <NumberInput :default-value="1" :min="0">
        <NumberInputGroup>
          <NumberInputDecrement aria-label="إنقاص">
            <Minus />
          </NumberInputDecrement>
          <NumberInputControl />
          <NumberInputIncrement aria-label="زيادة">
            <Plus />
          </NumberInputIncrement>
        </NumberInputGroup>
      </NumberInput>
    </Field>
  </div>
</template>
