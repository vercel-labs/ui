<script setup lang="ts">
import type { ChangeDetails } from "@ui-sdk/core"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@ui-sdk/vue"
import {
  describeChange,
  hoverPopupsFixture as fixture,
} from "tests/fixtures/hover-popups.ts"
import { ref } from "vue"

const change = ref("")

function opened(component: string, open: boolean, { event }: ChangeDetails) {
  if (open) {
    change.value = describeChange(component, "open", event)
  }
}

function payloadChanged(
  component: string,
  payload: unknown,
  { event }: ChangeDetails
) {
  change.value = describeChange(component, `payload ${payload}`, event)
}
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Tooltip
      :delay="0"
      @open-change="(open, details) => opened('tooltip', open, details)"
      @payload-change="
        (payload, details) => payloadChanged('tooltip', payload, details)
      "
    >
      <TooltipTrigger
        v-for="day in fixture.days"
        :key="day"
        :payload="day.toLowerCase()"
      >
        {{ day }}
      </TooltipTrigger>
      <TooltipContent v-slot="{ state }" class="tooltip"
        >Tip for {{ state.payload }}</TooltipContent
      >
    </Tooltip>
    <HoverCard
      :delay="0"
      :close-delay="0"
      @open-change="(open, details) => opened('hover card', open, details)"
      @payload-change="
        (payload, details) => payloadChanged('hover card', payload, details)
      "
    >
      <HoverCardTrigger
        v-for="person in fixture.people"
        :key="person"
        :href="`#${person}`"
        :payload="person.toLowerCase()"
      >
        {{ person }}
      </HoverCardTrigger>
      <HoverCardContent v-slot="{ state }" class="hover-card"
        >Card for {{ state.payload }}</HoverCardContent
      >
    </HoverCard>
    <Popover
      open-on-hover
      :delay="0"
      :close-delay="0"
      @open-change="(open, details) => opened('popover', open, details)"
    >
      <PopoverTrigger>{{ fixture.popover.trigger }}</PopoverTrigger>
      <PopoverContent class="popup">{{
        fixture.popover.content
      }}</PopoverContent>
    </Popover>
    <output role="status" aria-label="Last change">{{ change }}</output>
  </div>
</template>
