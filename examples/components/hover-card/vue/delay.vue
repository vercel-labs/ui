<script setup lang="ts">
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui-sdk/vue/hover-card"
import { ref } from "vue"

const timings = [
  { label: "Instant", delay: 0, closeDelay: 0 },
  { label: "Default", delay: 600, closeDelay: 300 },
  { label: "Patient", delay: 1200, closeDelay: 600 },
]
const enabled = ref(true)
const hrefOf = (label: string) => `https://example.com/${label.toLowerCase()}`
</script>

<template>
  <div data-slot="stack">
    <div data-slot="row">
      <HoverCard
        v-for="timing in timings"
        :key="timing.label"
        :delay="timing.delay"
        :close-delay="timing.closeDelay"
        :disabled="!enabled"
      >
        <HoverCardTrigger :href="hrefOf(timing.label)">{{ timing.label }}</HoverCardTrigger>
        <HoverCardContent>
          <p>{{ timing.label }}</p>
          <p data-slot="hint">
            Opens after {{ timing.delay }}ms and closes {{ timing.closeDelay }}ms after the pointer leaves.
          </p>
        </HoverCardContent>
      </HoverCard>
    </div>
    <label data-slot="label">
      <input v-model="enabled" type="checkbox" />
      Show cards
    </label>
  </div>
</template>
