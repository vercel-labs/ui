<script setup lang="ts">
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui-sdk/vue/hover-card"

const ada = {
  handle: "ada",
  name: "Ada Lovelace",
  initials: "AL",
  bio: "Wrote the first published program, for the Analytical Engine.",
}
</script>

<template>
  <HoverCard>
    <HoverCardTrigger href="https://example.com/people/ada">
      <template #render="{ props }">
        <a v-bind="props">
          <span data-slot="avatar" aria-hidden="true">{{ ada.initials }}</span>
          {{ ada.name }}
        </a>
      </template>
    </HoverCardTrigger>
    <HoverCardContent>
      <template #render="{ props }">
        <article v-bind="props">
          <p>@{{ ada.handle }}</p>
          <p>{{ ada.bio }}</p>
        </article>
      </template>
    </HoverCardContent>
  </HoverCard>
</template>
