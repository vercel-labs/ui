<script setup lang="ts">
import {
  Timeline,
  TimelineConnector,
  TimelineDescription,
  TimelineItem,
  TimelineMarker,
  TimelineTime,
  TimelineTitle,
  createTimelineController,
} from "@ui-sdk/vue/timeline"
import { ref } from "vue"
import {
  advance,
  timelineFixture as f,
  timelineOptions,
  type TimelineFixtureEvent,
} from "tests/fixtures/timeline.ts"

const controller = createTimelineController()
const options = timelineOptions()
const events = ref<readonly TimelineFixtureEvent[]>(f.events)
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Timeline
      class="timeline"
      :aria-label="f.label"
      :controller="controller"
      v-bind="options"
    >
      <TimelineItem
        v-for="event in events"
        :key="event.value"
        :value="event.value"
        :status="event.status"
      >
        <TimelineMarker />
        <TimelineConnector />
        <TimelineTitle>{{ event.title }}</TimelineTitle>
        <TimelineTime :datetime="event.dateTime">{{ event.time }}</TimelineTime>
        <TimelineDescription>{{ event.description }}</TimelineDescription>
        <a v-if="event.link" :href="event.link.href">{{ event.link.label }}</a>
      </TimelineItem>
    </Timeline>
    <button>After</button>
    <button @click="events = [f.added, ...events]">Add Event</button>
    <button @click="events = [...events].reverse()">Reverse</button>
    <button @click="controller.focus('shipped')">Focus Current</button>
    <button @click="events = advance(events)">Advance</button>
  </div>
</template>
