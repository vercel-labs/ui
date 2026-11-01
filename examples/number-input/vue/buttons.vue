<script setup lang="ts">
import { Minus, Plus } from "@lucide/vue"
import {
  NumberInput,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
  NumberInputControl,
} from "@ui-sdk/vue/number-input"
</script>

<template>
  <NumberInput :default-value="1" :min="0">
    <NumberInputGroup>
      <NumberInputDecrement aria-label="Decrease">
        <Minus />
      </NumberInputDecrement>
      <NumberInputControl aria-label="Quantity" />
      <NumberInputIncrement aria-label="Increase">
        <Plus />
      </NumberInputIncrement>
    </NumberInputGroup>
  </NumberInput>
</template>
