<script setup lang="ts">
import { ZoomIn, ZoomOut } from "@lucide/vue"
import {
  createNumberInputController,
  NumberInput,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
  NumberInputControl,
} from "@ui-sdk/vue/number-input"
import { Field, FieldLabel } from "@ui-sdk/vue/field"
import { ref } from "vue"

const zoom = createNumberInputController()
const reading = ref("")
</script>

<template>
  <div data-slot="stack">
    <Field>
      <FieldLabel>Zoom</FieldLabel>
      <NumberInput :default-value="100" :min="10" :max="400" :step="10" :controller="zoom">
        <NumberInputGroup>
          <NumberInputDecrement aria-label="Zoom out">
            <ZoomOut aria-hidden="true" />
          </NumberInputDecrement>
          <NumberInputControl />
          <NumberInputIncrement aria-label="Zoom in">
            <ZoomIn aria-hidden="true" />
          </NumberInputIncrement>
        </NumberInputGroup>
      </NumberInput>
    </Field>
    <div data-slot="row">
      <button type="button" @click="zoom.decrement({ large: true })">−100</button>
      <button type="button" @click="zoom.increment()">+10</button>
      <button type="button" @click="zoom.setValue(100)">Actual size</button>
      <button type="button" @click="reading = `Zoom is ${zoom.getValue()}.`">Read</button>
      <button type="button" @click="zoom.focus()">Focus</button>
    </div>
    <output data-slot="output">{{ reading }}</output>
  </div>
</template>
