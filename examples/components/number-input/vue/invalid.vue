<script setup lang="ts">
import { MinusIcon, PlusIcon } from "@lucide/vue"
import { Field, FieldError, FieldLabel } from "@ui-sdk/vue/field"
import {
  NumberInput,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
  NumberInputControl,
} from "@ui-sdk/vue/number-input"
import { ref } from "vue"

const submitted = ref("")

function onSubmit(event: Event) {
  submitted.value = String(new FormData(event.currentTarget as HTMLFormElement).get("age"))
}
</script>

<template>
  <form data-slot="stack" @submit.prevent="onSubmit">
    <Field>
      <FieldLabel>Age</FieldLabel>
      <NumberInput name="age" required :min="18" :max="120" @value-change="submitted = ''">
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
      <div>
        <FieldError match="valueMissing">Enter your age.</FieldError>
      </div>
    </Field>
    <button type="submit">Continue</button>
    <output data-slot="output">{{ submitted ? `Submitted: age=${submitted}` : "" }}</output>
  </form>
</template>
