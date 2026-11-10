<script setup lang="ts">
import {
  Chronology,
  ChronologyConnector,
  ChronologyDescription,
  ChronologyItem,
  ChronologyMarker,
  ChronologyTime,
  ChronologyTitle,
  createChronologyController,
} from "@ui-sdk/vue/chronology"
import { ref } from "vue"
import {
  advance,
  chronologyFixture as f,
  chronologyOptions,
  type ChronologyFixtureEvent,
} from "tests/fixtures/chronology.ts"

const controller = createChronologyController()
const options = chronologyOptions()
const events = ref<readonly ChronologyFixtureEvent[]>(f.events)
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Chronology
      class="chronology"
      :aria-label="f.label"
      :controller="controller"
      v-bind="options"
    >
      <ChronologyItem
        v-for="event in events"
        :key="event.value"
        :value="event.value"
        :status="event.status"
      >
        <ChronologyMarker />
        <ChronologyConnector />
        <ChronologyTitle>{{ event.title }}</ChronologyTitle>
        <ChronologyTime :datetime="event.dateTime">{{
          event.time
        }}</ChronologyTime>
        <ChronologyDescription>{{ event.description }}</ChronologyDescription>
        <a v-if="event.link" :href="event.link.href">{{ event.link.label }}</a>
      </ChronologyItem>
    </Chronology>
    <button>After</button>
    <button @click="events = [f.added, ...events]">Add Event</button>
    <button @click="events = [...events].reverse()">Reverse</button>
    <button @click="controller.focus('shipped')">Focus Current</button>
    <button @click="events = advance(events)">Advance</button>
  </div>
</template>
