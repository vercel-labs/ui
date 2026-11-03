<script setup lang="ts">
import { MinusIcon, PlusIcon } from "@lucide/vue"
import { Field, FieldLabel } from "@ui-sdk/vue/field"
import {
  NumberInput,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
  NumberInputControl,
} from "@ui-sdk/vue/number-input"
import { ref, useId } from "vue"

const submitted = ref("")
const form = useId()

function onSubmit(event: Event) {
  const data = [...new FormData(event.currentTarget as HTMLFormElement)].map(
    ([name, value]) => `${name}=${value}`,
  )
  submitted.value = data.join(", ")
}
</script>

<template>
  <div data-slot="stack">
    <form data-slot="stack" :id="form" @submit.prevent="onSubmit" @reset="submitted = ''">
      <Field>
        <FieldLabel>Quantity</FieldLabel>
        <NumberInput name="quantity" :default-value="2" :min="1">
          <NumberInputGroup>
            <NumberInputDecrement aria-label="Decrease">
              <MinusIcon aria-hidden="true" />
            </NumberInputDecrement>
            <NumberInputControl />
            <NumberInputIncrement aria-label="Increase">
              <PlusIcon aria-hidden="true" />
            </NumberInputIncrement>
          </NumberInputGroup>
        </NumberInput>
      </Field>
      <Field>
        <FieldLabel>Tip</FieldLabel>
        <NumberInput
          name="tip"
          :default-value="1234.5"
          :min="0"
          :step="0.01"
          :format="{ style: 'currency', currency: 'USD' }"
        >
          <NumberInputGroup>
            <NumberInputDecrement aria-label="Decrease">
              <MinusIcon aria-hidden="true" />
            </NumberInputDecrement>
            <NumberInputControl />
            <NumberInputIncrement aria-label="Increase">
              <PlusIcon aria-hidden="true" />
            </NumberInputIncrement>
          </NumberInputGroup>
        </NumberInput>
      </Field>
      <div data-slot="row">
        <button type="submit">Save</button>
        <button type="reset">Reset</button>
      </div>
    </form>
    <Field>
      <FieldLabel>Gift cards</FieldLabel>
      <NumberInput name="gift-cards" :form="form" :default-value="0" :min="0">
        <NumberInputGroup>
          <NumberInputDecrement aria-label="Decrease">
            <MinusIcon aria-hidden="true" />
          </NumberInputDecrement>
          <NumberInputControl />
          <NumberInputIncrement aria-label="Increase">
            <PlusIcon aria-hidden="true" />
          </NumberInputIncrement>
        </NumberInputGroup>
      </NumberInput>
    </Field>
    <output data-slot="output">{{ submitted ? `Submitted: ${submitted}` : "" }}</output>
  </div>
</template>
