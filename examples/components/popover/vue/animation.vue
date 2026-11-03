<script setup lang="ts">
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/vue/popover"
import { ref } from "vue"

const status = ref("Closed")
</script>

<template>
  <Popover
    @open-change="(open: boolean) => (status = open ? 'Opening' : 'Closing')"
    @open-change-complete="(open: boolean) => (status = open ? 'Open' : 'Closed')"
  >
    <PopoverTrigger>Animated</PopoverTrigger>
    <PopoverContent keep-mounted>
      <PopoverTitle>Scale and fade</PopoverTitle>
      <PopoverDescription>300ms in and out, from the trigger.</PopoverDescription>
    </PopoverContent>
  </Popover>
  <output data-slot="output">{{ status }}</output>
</template>
