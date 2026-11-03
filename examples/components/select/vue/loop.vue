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
import { CheckIcon, ChevronDownIcon } from "@lucide/vue"

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grapes", label: "Grapes" },
  { value: "pineapple", label: "Pineapple" },
]
</script>

<template>
  <Select :loop="false" default-value="pineapple">
    <div data-slot="stack">
      <SelectLabel>Fruit</SelectLabel>
      <SelectTrigger>
        <SelectValue />
        <ChevronDownIcon />
      </SelectTrigger>
      <p data-slot="hint">Open it and press ArrowDown.</p>
    </div>
    <SelectContent>
      <SelectItem v-for="fruit in fruits" :key="fruit.value" :value="fruit.value">
        {{ fruit.label }}
        <SelectItemIndicator>
          <CheckIcon />
        </SelectItemIndicator>
      </SelectItem>
    </SelectContent>
  </Select>
</template>
