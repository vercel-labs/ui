<script setup lang="ts">
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/vue/popover"
import { ref } from "vue"

const modes = [
  { label: "Non-modal", modal: false },
  { label: "Trap focus", modal: "trap-focus" },
  { label: "Modal", modal: true },
] as const
const clicks = ref(0)
</script>

<template>
  <div data-slot="stack">
    <div data-slot="row">
      <Popover v-for="mode in modes" :key="mode.label" :modal="mode.modal">
        <PopoverTrigger>{{ mode.label }}</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>{{ mode.label }}</PopoverTitle>
          <PopoverDescription>Press Tab, then click the box below.</PopoverDescription>
          <PopoverClose>Close</PopoverClose>
        </PopoverContent>
      </Popover>
    </div>
    <button type="button" @click="clicks++">
      Clicked {{ clicks }} {{ clicks === 1 ? "time" : "times" }}. Open a popover, then click here.
    </button>
  </div>
</template>
