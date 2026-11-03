<script setup lang="ts">
import { HoverCard, HoverCardArrow, HoverCardContent, HoverCardTrigger } from "@ui-sdk/vue/hover-card"
import { ref } from "vue"

const sides = ["top", "right", "bottom", "left"] as const
const aligns = ["start", "center", "end"] as const
const alan = {
  handle: "alan",
  name: "Alan Turing",
  bio: "Described the universal machine every computer descends from.",
}
const side = ref<(typeof sides)[number]>("bottom")
const align = ref<(typeof aligns)[number]>("center")
</script>

<template>
  <div data-slot="stack">
    <div data-slot="grid">
      <span data-slot="hint">side</span>
      <div data-slot="row" role="group" aria-label="side">
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
    </div>
    <HoverCard>
      <HoverCardTrigger href="https://example.com/people/alan">@{{ alan.handle }}</HoverCardTrigger>
      <HoverCardContent :side="side" :align="align" :side-offset="10" :arrow-padding="12">
        <HoverCardArrow />
        <p>{{ alan.name }}</p>
        <p>{{ alan.bio }}</p>
      </HoverCardContent>
    </HoverCard>
  </div>
</template>
