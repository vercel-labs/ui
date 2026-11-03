<script setup lang="ts">
import {
  createHoverCardController,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@ui-sdk/vue/hover-card"
import { ref } from "vue"

const grace = {
  handle: "grace",
  name: "Grace Hopper",
  bio: "Built the first compiler and popularized the word “debugging”.",
}
const card = createHoverCardController()
const open = ref(false)
const reason = ref("")
</script>

<template>
  <div data-slot="stack">
    <div data-slot="row">
      <HoverCard
        v-model:open="open"
        :controller="card"
        @open-change="(_, details) => (reason = details.reason)"
      >
        <HoverCardTrigger href="https://example.com/people/grace">@{{ grace.handle }}</HoverCardTrigger>
        <HoverCardContent>
          <p>{{ grace.name }}</p>
          <p>{{ grace.bio }}</p>
        </HoverCardContent>
      </HoverCard>
      <button type="button" @click="card.open()">Show from elsewhere</button>
    </div>
    <output data-slot="output"
      >{{ open ? "Open" : "Closed" }}{{ reason && `, last change: ${reason}` }}</output
    >
  </div>
</template>
