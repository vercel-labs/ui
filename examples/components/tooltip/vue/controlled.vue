<script setup lang="ts">
import { createTooltipController, Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/vue/tooltip"
import { ref } from "vue"

const tooltip = createTooltipController()
const open = ref(false)
const reason = ref("")
</script>

<template>
  <div data-slot="stack">
    <div data-slot="row">
      <Tooltip
        v-model:open="open"
        :controller="tooltip"
        @open-change="(_, details) => (reason = details.reason)"
      >
        <TooltipTrigger>Export</TooltipTrigger>
        <TooltipContent>Download a CSV of this table</TooltipContent>
      </Tooltip>
      <button type="button" @click="tooltip.open()">Show from elsewhere</button>
    </div>
    <output data-slot="output"
      >{{ open ? "Open" : "Closed" }}{{ reason && `, last change: ${reason}` }}</output
    >
  </div>
</template>
