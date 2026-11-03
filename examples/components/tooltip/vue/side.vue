<script setup lang="ts">
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/vue/tooltip"

const sides = [
  { side: "left", label: "Left" },
  { side: "top", label: "Top" },
  { side: "bottom", label: "Bottom" },
  { side: "right", label: "Right" },
] as const
</script>

<template>
  <div data-slot="row">
    <Tooltip v-for="{ side, label } in sides" :key="side">
      <TooltipTrigger>{{ label }}</TooltipTrigger>
      <TooltipContent :side="side">Add to library</TooltipContent>
    </Tooltip>
  </div>
</template>
