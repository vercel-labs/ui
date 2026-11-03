<script setup lang="ts">
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/vue/tooltip"
import { ref } from "vue"

const container = ref<HTMLDivElement | null>(null)
</script>

<template>
  <div data-slot="stack">
    <Tooltip :container="container">
      <TooltipTrigger>Show in the box</TooltipTrigger>
      <TooltipContent>This tooltip is in the box below, in the DOM.</TooltipContent>
    </Tooltip>
    <div data-slot="card">
      Container
      <div ref="container" />
    </div>
  </div>
</template>
