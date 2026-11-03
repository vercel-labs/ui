<script setup lang="ts">
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/vue/popover"

const dimensions = [
  { label: "Width", value: "100%" },
  { label: "Max. width", value: "300px" },
  { label: "Height", value: "25px" },
  { label: "Max. height", value: "none" },
]
</script>

<template>
  <Popover>
    <PopoverTrigger>Open popover</PopoverTrigger>
    <PopoverContent>
      <PopoverTitle>Dimensions</PopoverTitle>
      <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
      <div data-slot="stack">
        <label v-for="dimension in dimensions" :key="dimension.label" data-slot="label">
          {{ dimension.label }}
          <input :value="dimension.value" />
        </label>
      </div>
    </PopoverContent>
  </Popover>
</template>
