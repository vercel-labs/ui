<script setup lang="ts">
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui-sdk/vue/hover-card"
import { ref } from "vue"

const sideOffsets = [4, 12, 24]
const alignOffsets = [-16, 0, 16]
const paddings = [8, 48]
const sideOffset = ref(4)
const alignOffset = ref(0)
const collisionPadding = ref(8)
</script>

<template>
  <div data-slot="stack">
    <div data-slot="grid">
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
    <HoverCard>
      <HoverCardTrigger href="https://example.com/offsets">Offsets</HoverCardTrigger>
      <HoverCardContent
        align="start"
        :side-offset="sideOffset"
        :align-offset="alignOffset"
        :collision-padding="collisionPadding"
      >
        <p>Offsets</p>
        <p data-slot="hint">
          {{ sideOffset }}px from the link, shifted {{ alignOffset }}px, {{ collisionPadding }}px from the
          edges.
        </p>
      </HoverCardContent>
    </HoverCard>
  </div>
</template>
