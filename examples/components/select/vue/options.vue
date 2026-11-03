<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectItemIndicator,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  type ListData,
} from "@ui-sdk/vue/select"
import { CheckIcon, ChevronDownIcon } from "@lucide/vue"

const sizeGroups = [
  { type: "group", label: "Common", items: ["Small", "Medium", "Large"] },
  { type: "group", label: "Extended", items: ["Extra small", "Extra large"] },
] satisfies ListData
</script>

<template>
  <Select :items="sizeGroups" name="size" default-value="Medium">
    <div data-slot="stack">
      <SelectLabel>Size</SelectLabel>
      <SelectTrigger>
        <SelectValue />
        <ChevronDownIcon />
      </SelectTrigger>
    </div>
    <SelectContent>
      <SelectGroup v-for="group in sizeGroups" :key="group.label">
        <SelectGroupLabel>{{ group.label }}</SelectGroupLabel>
        <SelectItem v-for="size in group.items" :key="size" :value="size">
          {{ size }}
          <SelectItemIndicator>
            <CheckIcon />
          </SelectItemIndicator>
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
