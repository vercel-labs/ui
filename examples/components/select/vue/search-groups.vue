<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectEmpty,
  SelectGroup,
  SelectGroupLabel,
  SelectInput,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectList,
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
    <div data-slot="stack">
      <SelectLabel>Produce</SelectLabel>
      <SelectTrigger>
        <SelectValue />
        <ChevronDownIcon />
      </SelectTrigger>
    </div>
    <SelectContent>
      <SelectInput aria-label="Search produce" placeholder="Search…" />
      <SelectEmpty>Nothing found.</SelectEmpty>
      <SelectList>
        <SelectGroup v-for="group in produce" :key="group.label">
          <SelectGroupLabel>
            {{ group.label }}
          </SelectGroupLabel>
          <SelectItem v-for="item in group.items" :key="item.value" :value="item.value" :label="item.label">
            <SelectItemText>
              <template #render="{ props, state }">
                <span v-bind="props">
                  <template v-for="(segment, index) in state.segments" :key="index">
                    <b v-if="segment.match">{{ segment.text }}</b>
                    <template v-else>{{ segment.text }}</template>
                  </template>
                </span>
              </template>
            </SelectItemText>
            <SelectItemIndicator>
              <CheckIcon />
            </SelectItemIndicator>
          </SelectItem>
        </SelectGroup>
      </SelectList>
    </SelectContent>
  </Select>
</template>
