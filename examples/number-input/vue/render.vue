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
  <Field>
    <FieldLabel>Temperature</FieldLabel>
    <NumberInput :default-value="-2" :min="-20" :max="40" :format="{ style: 'unit', unit: 'celsius' }">
      <NumberInputGroup>
        <NumberInputDecrement aria-label="Colder">
          <template #render="{ props, state }">
            <button v-bind="props" :title="state.atBound ? 'As cold as it goes' : 'Colder'">
              <Minus />
            </button>
          </template>
        </NumberInputDecrement>
        <NumberInputControl>
          <template #render="{ props, state }">
            <input v-bind="props" />
          </template>
        </NumberInputControl>
        <NumberInputIncrement v-slot="{ state }" aria-label="Warmer">
          <span v-if="state.atBound">Max</span>
          <Plus v-else />
        </NumberInputIncrement>
      </NumberInputGroup>
    </NumberInput>
  </Field>
</template>
