<script setup lang="ts">
import { Field, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/vue/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/vue/select"
import { ref } from "vue"
import { CheckIcon, ChevronDownIcon } from "@lucide/vue"

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grapes", label: "Grapes" },
  { value: "pineapple", label: "Pineapple" },
]

const submitted = ref("")

function submit(event: Event) {
  submitted.value = `Ordered ${new FormData(event.currentTarget as HTMLFormElement).get("fruit")}.`
}
</script>

<template>
  <form data-slot="stack" @submit.prevent="submit">
    <Field name="fruit">
      <FieldLabel> Fruit </FieldLabel>
      <Select required placeholder="Select a fruit">
        <SelectTrigger>
          <SelectValue />
          <ChevronDownIcon />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="fruit in fruits" :key="fruit.value" :value="fruit.value">
            {{ fruit.label }}
            <SelectItemIndicator>
              <CheckIcon />
            </SelectItemIndicator>
          </SelectItem>
        </SelectContent>
      </Select>
      <FieldDescription>We deliver it tomorrow.</FieldDescription>
      <FieldError match="valueMissing">Pick a fruit to order.</FieldError>
    </Field>
    <button type="submit">Order</button>
    <output data-slot="output">{{ submitted }}</output>
  </form>
</template>
