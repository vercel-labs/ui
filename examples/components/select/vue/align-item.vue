<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectLabel,
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

const aligned = ref(true)
</script>

<template>
  <div data-slot="stack">
    <Select default-value="blueberry">
      <div data-slot="stack">
        <SelectLabel>Fruit</SelectLabel>
        <SelectTrigger>
          <SelectValue />
          <ChevronDownIcon />
        </SelectTrigger>
      </div>
      <SelectContent :align-item-with-trigger="aligned">
        <SelectItem v-for="fruit in fruits" :key="fruit.value" :value="fruit.value">
          {{ fruit.label }}
          <SelectItemIndicator>
            <CheckIcon />
          </SelectItemIndicator>
        </SelectItem>
      </SelectContent>
    </Select>
    <label data-slot="label">
      <input v-model="aligned" type="checkbox" />
      Align item with trigger
    </label>
  </div>
</template>
