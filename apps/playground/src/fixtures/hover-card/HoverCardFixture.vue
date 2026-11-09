<script setup lang="ts">
import type { ChangeDetails } from "@ui-sdk/core"
import {
  HoverCard,
  HoverCardArrow,
  HoverCardContent,
  HoverCardTrigger,
} from "@ui-sdk/vue"
import {
  hoverCardContentOptions,
  hoverCardFixture as fixture,
  hoverCardOptions,
} from "tests/fixtures/hover-card.ts"
import { ref } from "vue"

const options = hoverCardOptions()
const content = hoverCardContentOptions()
const action = ref("")

function report(open: boolean, { reason }: ChangeDetails) {
  action.value = `${open ? "open" : "close"}: ${reason}`
}
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <HoverCard v-bind="options" @open-change="report">
      <HoverCardTrigger :href="fixture.href">{{
        fixture.trigger
      }}</HoverCardTrigger>
      <HoverCardContent class="hover-card" v-bind="content">
        <HoverCardArrow class="arrow" />
        <p>
          <strong>{{ fixture.name }}</strong>
        </p>
        <p>{{ fixture.bio }}</p>
        <a :href="fixture.linkHref">{{ fixture.link }}</a>
      </HoverCardContent>
    </HoverCard>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
  </div>
</template>
