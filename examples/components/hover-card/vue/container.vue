<script setup lang="ts">
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui-sdk/vue/hover-card"
import { ref } from "vue"

const container = ref<HTMLDivElement | null>(null)
</script>

<template>
  <div data-slot="stack">
    <HoverCard>
      <HoverCardTrigger href="https://example.com/box">Show in the box</HoverCardTrigger>
      <HoverCardContent :container="container">
        <p>Portaled</p>
        <p data-slot="hint">This card is in the box below, in the DOM.</p>
      </HoverCardContent>
    </HoverCard>
    <div data-slot="card">
      Container
      <div ref="container" />
    </div>
  </div>
</template>
