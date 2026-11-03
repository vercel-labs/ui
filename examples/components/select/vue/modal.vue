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

const modes = [
  { value: "pointer", label: "Pointer" },
  { value: true, label: "Modal" },
  { value: false, label: "Non-modal" },
] as const

const modal = ref<boolean | "pointer">("pointer")
const presses = ref(0)
</script>

<template>
  <div data-slot="stack">
    <div role="group" aria-label="Modal" data-slot="row">
      <button
        v-for="mode in modes"
        :key="mode.label"
        type="button"
        :aria-pressed="modal === mode.value"
        @click="modal = mode.value"
      >
        {{ mode.label }}
      </button>
    </div>
    <Select :modal="modal" default-value="apple">
      <div data-slot="stack">
        <SelectLabel>Fruit</SelectLabel>
        <SelectTrigger>
          <SelectValue />
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
    <button type="button" @click="presses++">Pressed {{ presses }} times</button>
  </div>
</template>
