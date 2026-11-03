<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectItemIndicator,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/vue/select"
import { CheckIcon, ChevronDownIcon } from "@lucide/vue"

const produce = [
  {
    label: "Fruits",
    items: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
      { value: "orange", label: "Orange" },
    ],
  },
  {
    label: "Vegetables",
    items: [
      { value: "carrot", label: "Carrot" },
      { value: "broccoli", label: "Broccoli" },
      { value: "spinach", label: "Spinach" },
    ],
  },
]
</script>

<template>
  <Select placeholder="Select produce">
    <SelectTrigger aria-label="Produce">
      <SelectValue />
      <ChevronDownIcon />
    </SelectTrigger>
    <SelectContent>
      <template v-for="(group, index) in produce" :key="group.label">
        <SelectSeparator v-if="index > 0" />
        <SelectGroup>
          <SelectGroupLabel>
            {{ group.label }}
          </SelectGroupLabel>
          <SelectItem v-for="item in group.items" :key="item.value" :value="item.value">
            {{ item.label }}
            <SelectItemIndicator>
              <CheckIcon />
            </SelectItemIndicator>
          </SelectItem>
        </SelectGroup>
      </template>
    </SelectContent>
  </Select>
</template>
