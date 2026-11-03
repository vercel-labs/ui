<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectLabel,
  SelectSelectAll,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/vue/select"
import { CheckIcon, ChevronDownIcon, MinusIcon } from "@lucide/vue"

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grapes", label: "Grapes" },
  { value: "pineapple", label: "Pineapple" },
]
</script>

<template>
  <Select multiple :default-value="['apple', 'banana', 'grapes']" placeholder="Select fruits">
    <div data-slot="stack">
      <SelectLabel>Fruits</SelectLabel>
      <SelectTrigger>
        <SelectValue :max="2" :more-label="(count: number) => `${count} more`" />
        <ChevronDownIcon />
      </SelectTrigger>
    </div>
    <SelectContent>
      <SelectSelectAll v-slot="{ state }">
        Select all
        <CheckIcon v-if="state.checked" />
        <MinusIcon v-if="state.indeterminate" />
      </SelectSelectAll>
      <SelectSeparator />
      <SelectItem v-for="fruit in fruits" :key="fruit.value" :value="fruit.value">
        {{ fruit.label }}
        <SelectItemIndicator>
          <CheckIcon />
        </SelectItemIndicator>
      </SelectItem>
    </SelectContent>
  </Select>
</template>
