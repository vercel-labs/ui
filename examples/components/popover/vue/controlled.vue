<script setup lang="ts">
import {
  createPopoverController,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/vue/popover"
import { ref } from "vue"

const popover = createPopoverController()
const open = ref(false)
const reason = ref("")
</script>

<template>
  <div data-slot="stack">
    <div data-slot="row">
      <Popover
        v-model:open="open"
        :controller="popover"
        @open-change="(_: boolean, details: { reason: string }) => (reason = details.reason)"
      >
        <PopoverTrigger>Share</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Share this file</PopoverTitle>
          <PopoverDescription>Anyone with the link can view it.</PopoverDescription>
          <PopoverClose>Done</PopoverClose>
        </PopoverContent>
      </Popover>
      <button type="button" data-variant="ghost" @click="popover.open()">Open from elsewhere</button>
    </div>

    <output data-slot="output"
      >{{ open ? "Open" : "Closed" }}{{ reason && `, last change: ${reason}` }}</output
    >
  </div>
</template>
