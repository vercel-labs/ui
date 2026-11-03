<script setup lang="ts">
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui-sdk/vue/hover-card"
import { ref } from "vue"

const grace = {
  handle: "grace",
  name: "Grace Hopper",
  bio: "Built the first compiler and popularized the word “debugging”.",
}
const status = ref("Closed")
</script>

<template>
  <div data-slot="stack">
    <HoverCard
      @open-change="(open) => (status = open ? 'Opening' : 'Closing')"
      @open-change-complete="(open) => (status = open ? 'Open' : 'Closed')"
    >
      <HoverCardTrigger href="https://example.com/people/grace">@{{ grace.handle }}</HoverCardTrigger>
      <HoverCardContent keep-mounted>
        <p>{{ grace.name }}</p>
        <p>{{ grace.bio }}</p>
      </HoverCardContent>
    </HoverCard>
    <output data-slot="output">{{ status }}</output>
  </div>
</template>
