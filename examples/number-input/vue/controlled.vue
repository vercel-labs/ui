<script setup lang="ts">
import { Minus, Plus } from "@lucide/vue"
import type { NumberInputValueChangeReason } from "@ui-sdk/core/number-input"
import { Field, FieldLabel } from "@ui-sdk/vue/field"
import {
  NumberInput,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
  NumberInputControl,
} from "@ui-sdk/vue/number-input"
import { ref } from "vue"

const value = ref<number | null>(4)
const committed = ref("")

function onCommit(next: number | null, details: { reason: NumberInputValueChangeReason }) {
  committed.value = `${next ?? "empty"}, after ${details.reason}`
}
</script>

<template>
  <div data-slot="stack">
    <Field>
      <FieldLabel>Servings</FieldLabel>
      <NumberInput v-model:value="value" :min="1" :max="12" @value-commit="onCommit">
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
    <div data-slot="row">
      <button type="button" @click="value = 4">Reset to 4</button>
      <button type="button" @click="value = null">Clear</button>
    </div>
    <output data-slot="output">
      <span>Value: {{ value ?? "empty" }}</span>
      <span>Committed: {{ committed || "nothing yet" }}</span>
    </output>
  </div>
</template>
