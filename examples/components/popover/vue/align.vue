<script setup lang="ts">
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/vue/popover"

const aligns = ["start", "center", "end"] as const
</script>

<template>
  <div data-slot="row">
    <Popover v-for="align in aligns" :key="align">
      <PopoverTrigger>Align {{ align }}</PopoverTrigger>
      <PopoverContent :align="align">
        <PopoverTitle>Aligned to the {{ align }}</PopoverTitle>
        <PopoverDescription>The popover lines up with the trigger's {{ align }}.</PopoverDescription>
      </PopoverContent>
    </Popover>
  </div>
</template>
