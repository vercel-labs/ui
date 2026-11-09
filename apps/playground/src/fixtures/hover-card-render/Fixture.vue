<script setup lang="ts">
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui-sdk/vue"
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <HoverCard :delay="100" :close-delay="100">
      <HoverCardTrigger>
        <template #render="{ props, state }">
          <a
            v-bind="props"
            href="#repo"
            :class="state.open ? 'is-open' : 'is-closed'"
          >
            ui-sdk <span aria-hidden="true">{{ state.open ? "▲" : "▼" }}</span>
          </a>
        </template>
      </HoverCardTrigger>
      <HoverCardContent class="hover-card" aria-label="Repository">
        <template #render="{ props }">
          <section v-bind="props">A headless UI kit.</section>
        </template>
      </HoverCardContent>
    </HoverCard>
    <button>After</button>
  </div>
</template>
