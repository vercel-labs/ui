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

const value = ref<string[]>(["apple", "grapes"])
</script>

<template>
  <div data-slot="stack">
    <Select v-model:value="value" multiple placeholder="Select fruits">
      <div data-slot="stack">
        <SelectLabel>Fruits</SelectLabel>
        <SelectTrigger>
          <SelectValue v-slot="{ state }">
            {{
              state.placeholder
                ? "Select fruits"
                : state.labels.length > 2
                  ? `${state.labels[0]} and ${state.labels.length - 1} more`
                  : state.label
            }}
          </SelectValue>
          <ChevronDownIcon />
        </SelectTrigger>
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
