<script setup lang="ts">
import {
  Timeline,
  TimelineConnector,
  TimelineDescription,
  TimelineItem,
  TimelineMarker,
  TimelineTime,
  TimelineTitle,
} from "@ui-sdk/vue"
import { perfItems, perfSize } from "tests/fixtures/perf.ts"

// A timeline with many events, each with every part, for the counts specs.
const items = perfItems(perfSize())
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Timeline aria-label="Activity">
      <TimelineItem v-for="item in items" :key="item.value">
        <TimelineMarker />
        <TimelineConnector />
        <TimelineTitle>{{ item.label }}</TimelineTitle>
        <TimelineTime datetime="2026-11-10">Nov 10</TimelineTime>
        <TimelineDescription>Something happened.</TimelineDescription>
      </TimelineItem>
    </Timeline>
    <button>After</button>
  </div>
</template>
