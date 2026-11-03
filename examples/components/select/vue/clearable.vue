<script setup lang="ts">
import {
  Select,
  SelectClear,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/vue/select"
import { ref } from "vue"
import { CheckIcon, ChevronDownIcon, XIcon } from "@lucide/vue"

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grapes", label: "Grapes" },
  { value: "pineapple", label: "Pineapple" },
]

const value = ref<string | null>("banana")
</script>

<template>
  <div data-slot="stack">
    <Select v-model:value="value" placeholder="Select a fruit">
      <div data-slot="stack">
        <SelectLabel>Fruit</SelectLabel>
        <div data-slot="row">
          <SelectTrigger>
            <SelectValue />
            <ChevronDownIcon />
          </SelectTrigger>
          <SelectClear aria-label="Clear fruit">
            <XIcon />
          </SelectClear>
        </div>
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
    <output data-slot="output">Value: {{ JSON.stringify(value) }}</output>
  </div>
</template>
