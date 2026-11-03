<script setup lang="ts">
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui-sdk/vue/hover-card"

const sides = ["left", "top", "bottom", "right"] as const
const hrefOf = (side: string) => `https://example.com/${side}`
</script>

<template>
  <div data-slot="row">
    <HoverCard v-for="side in sides" :key="side">
      <HoverCardTrigger :href="hrefOf(side)">{{ side }}</HoverCardTrigger>
      <HoverCardContent :side="side">
        <p>{{ side }}</p>
        <p data-slot="hint">The card opens on this side of the link.</p>
      </HoverCardContent>
    </HoverCard>
  </div>
</template>
