<script setup lang="ts">
import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/vue/popover"
import { ref } from "vue"

const sides = ["top", "right", "bottom", "left"] as const
const aligns = ["start", "center", "end"] as const
const side = ref<(typeof sides)[number]>("bottom")
const align = ref<(typeof aligns)[number]>("center")
const sideOffset = ref(8)
const alignOffset = ref(0)
const collisionPadding = ref(8)
</script>

<template>
  <div data-slot="stack">
    <div data-slot="stack">
      <div data-slot="row" role="group" aria-label="Side">
        <button
          v-for="value in sides"
          :key="value"
          type="button"
          data-size="sm"
          :aria-pressed="side === value"
          @click="side = value"
        >
          {{ value }}
        </button>
      </div>
      <div data-slot="row" role="group" aria-label="Align">
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
    </div>
    <div data-slot="stack">
      <label data-slot="label">
        Side offset<span data-slot="hint">{{ sideOffset }}px</span>
        <input v-model.number="sideOffset" type="range" min="0" max="32" />
      </label>
      <label data-slot="label">
        Align offset<span data-slot="hint">{{ alignOffset }}px</span>
        <input v-model.number="alignOffset" type="range" min="-24" max="24" />
      </label>
      <label data-slot="label">
        Collision padding<span data-slot="hint">{{ collisionPadding }}px</span>
        <input v-model.number="collisionPadding" type="range" min="0" max="48" />
      </label>
    </div>
    <Popover>
      <PopoverTrigger>Placement</PopoverTrigger>
      <PopoverContent
        :side="side"
        :align="align"
        :side-offset="sideOffset"
        :align-offset="alignOffset"
        :collision-padding="collisionPadding"
      >
        <PopoverArrow />
        <PopoverTitle>{{ side }} {{ align }}</PopoverTitle>
        <PopoverDescription>Choose a side, alignment, and offsets above.</PopoverDescription>
      </PopoverContent>
    </Popover>
  </div>
</template>
