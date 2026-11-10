<script setup lang="ts">
import {
  Chronology,
  ChronologyConnector,
  ChronologyItem,
  ChronologyMarker,
  ChronologyTime,
  ChronologyTitle,
} from "@ui-sdk/vue/chronology"

const milestones = [
  { title: "Kickoff", dateTime: "2026-01", time: "January" },
  { title: "Design review", dateTime: "2026-03", time: "March" },
  { title: "Beta", dateTime: "2026-06", time: "June" },
  { title: "Launch", dateTime: "2026-09", time: "September" },
]
</script>

<template>
  <Chronology orientation="horizontal" :loop="false" aria-label="Roadmap">
    <ChronologyItem v-for="milestone in milestones" :key="milestone.title">
      <ChronologyMarker />
      <ChronologyConnector />
      <ChronologyTitle>{{ milestone.title }}</ChronologyTitle>
      <ChronologyTime :datetime="milestone.dateTime">
        {{ milestone.time }}
      </ChronologyTime>
    </ChronologyItem>
  </Chronology>
</template>
