<script setup lang="ts">
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/vue/tooltip"
import { ref } from "vue"

const aligns = ["start", "center", "end"] as const
const sideOffsets = [4, 12, 24]
const alignOffsets = [-16, 0, 16]
const paddings = [8, 48]
const align = ref<(typeof aligns)[number]>("start")
const sideOffset = ref(4)
const alignOffset = ref(0)
const collisionPadding = ref(8)
</script>

<template>
  <div data-slot="stack">
    <div data-slot="grid">
      <span data-slot="hint">align</span>
      <div data-slot="row" role="group" aria-label="align">
        <button
          v-for="value in aligns"
          :key="value"
          type="button"
          data-size="sm"
          :aria-pressed="align === value"
          @click="align = value"
        >
          {{ value }}
        </button>
      </div>
      <span data-slot="hint">sideOffset</span>
      <div data-slot="row" role="group" aria-label="sideOffset">
        <button
          v-for="value in sideOffsets"
          :key="value"
          type="button"
          data-size="sm"
          :aria-pressed="sideOffset === value"
          @click="sideOffset = value"
        >
          {{ value }}
        </button>
      </div>
      <span data-slot="hint">alignOffset</span>
      <div data-slot="row" role="group" aria-label="alignOffset">
        <button
          v-for="value in alignOffsets"
          :key="value"
          type="button"
          data-size="sm"
          :aria-pressed="alignOffset === value"
          @click="alignOffset = value"
        >
          {{ value }}
        </button>
      </div>
      <span data-slot="hint">collisionPadding</span>
      <div data-slot="row" role="group" aria-label="collisionPadding">
        <button
          v-for="value in paddings"
          :key="value"
          type="button"
          data-size="sm"
          :aria-pressed="collisionPadding === value"
          @click="collisionPadding = value"
        >
          {{ value }}
        </button>
      </div>
    </div>
    <Tooltip>
      <TooltipTrigger>Offsets</TooltipTrigger>
      <TooltipContent
        :align="align"
        :side-offset="sideOffset"
        :align-offset="alignOffset"
        :collision-padding="collisionPadding"
        >{{ align }}, {{ sideOffset }}px away, shifted {{ alignOffset }}px</TooltipContent
      >
    </Tooltip>
  </div>
</template>
