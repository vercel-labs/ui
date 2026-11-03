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

const variants = ["disabled", "readOnly", "item"] as const
</script>

<template>
  <div data-slot="stack">
    <Select
      v-for="variant in variants"
      :key="variant"
      :default-value="variant === 'item' ? null : 'banana'"
      placeholder="Select a fruit"
      :disabled="variant === 'disabled'"
      :read-only="variant === 'readOnly'"
    >
      <div data-slot="stack">
        <SelectLabel>
          {{ variant === "disabled" ? "Disabled" : variant === "readOnly" ? "Read-only" : "Disabled item" }}
        </SelectLabel>
        <SelectTrigger>
          <SelectValue />
          <ChevronDownIcon />
        </SelectTrigger>
      </div>
      <SelectContent>
        <SelectItem
          v-for="fruit in fruits"
          :key="fruit.value"
          :value="fruit.value"
          :disabled="fruit.value === 'grapes'"
        >
          {{ fruit.label }}
          <SelectItemIndicator>
            <CheckIcon />
          </SelectItemIndicator>
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
