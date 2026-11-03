<script setup lang="ts">
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/vue/popover"
import { ref } from "vue"

const container = ref<HTMLDivElement | null>(null)
</script>

<template>
  <div data-slot="stack">
    <Popover>
      <PopoverTrigger>Open in the box</PopoverTrigger>
      <PopoverContent :container="container">
        <PopoverTitle>Portaled</PopoverTitle>
        <PopoverDescription>This popover is in the box below, in the DOM.</PopoverDescription>
      </PopoverContent>
    </Popover>
    <div data-slot="card">
      Container
      <div ref="container" />
    </div>
  </div>
</template>
