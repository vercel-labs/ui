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

const status = ref("Closed")
</script>

<template>
  <Select
    default-value="banana"
    @open-change="(open: boolean) => (status = open ? 'Opening…' : 'Closing…')"
    @open-change-complete="(open: boolean) => (status = open ? 'Open' : 'Closed')"
  >
    <div data-slot="stack">
      <SelectLabel>Fruit</SelectLabel>
      <SelectTrigger>
        <SelectValue />
        <ChevronDownIcon />
      </SelectTrigger>
      <output data-slot="output">{{ status }}</output>
    </div>
    <SelectContent>
      <SelectItem v-for="fruit in fruits" :key="fruit.value" :value="fruit.value">
        {{ fruit.label }}
        <SelectItemIndicator keep-mounted>
          <CheckIcon />
        </SelectItemIndicator>
      </SelectItem>
    </SelectContent>
  </Select>
</template>
