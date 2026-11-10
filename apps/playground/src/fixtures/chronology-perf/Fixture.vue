<script setup lang="ts">
import {
  Chronology,
  ChronologyConnector,
  ChronologyDescription,
  ChronologyItem,
  ChronologyMarker,
  ChronologyTime,
  ChronologyTitle,
} from "@ui-sdk/vue"
import { perfItems, perfSize } from "tests/fixtures/perf.ts"

// A chronology with many events, each with every part, for the counts specs.
const items = perfItems(perfSize())
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Chronology aria-label="Activity">
      <ChronologyItem v-for="item in items" :key="item.value">
        <ChronologyMarker />
        <ChronologyConnector />
        <ChronologyTitle>{{ item.label }}</ChronologyTitle>
        <ChronologyTime datetime="2026-11-10">Nov 10</ChronologyTime>
        <ChronologyDescription>Something happened.</ChronologyDescription>
      </ChronologyItem>
    </Chronology>
    <button>After</button>
  </div>
</template>
