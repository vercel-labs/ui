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

const sizes = ["Extra small", "Small", "Medium", "Large", "Extra large"]
</script>

<template>
  <div data-slot="stack">
    <Select placeholder="Select a size">
      <div data-slot="stack">
        <SelectLabel>Size</SelectLabel>
        <SelectTrigger>
          <SelectValue />
          <ChevronDownIcon />
        </SelectTrigger>
      </div>
      <SelectContent>
        <SelectItem v-for="size in sizes" :key="size" :value="size">
          {{ size }}
          <SelectItemIndicator>
            <CheckIcon />
          </SelectItemIndicator>
        </SelectItem>
      </SelectContent>
    </Select>
    <Select>
      <div data-slot="stack">
        <SelectLabel>Gift wrap</SelectLabel>
        <SelectTrigger>
          <SelectValue placeholder="None" />
          <ChevronDownIcon />
        </SelectTrigger>
      </div>
      <SelectContent>
        <SelectItem v-for="wrap in ['Paper', 'Ribbon', 'Box']" :key="wrap" :value="wrap">
          {{ wrap }}
          <SelectItemIndicator>
            <CheckIcon />
          </SelectItemIndicator>
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
