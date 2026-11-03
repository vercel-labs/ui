<script setup lang="ts">
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

const container = ref<HTMLDivElement | null>(null)
</script>

<template>
  <div data-slot="stack">
    <Select :container="container" default-value="apple">
      <SelectTrigger aria-label="Fruit">
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
    <div data-slot="card">
      Container
      <div ref="container" />
    </div>
  </div>
</template>
