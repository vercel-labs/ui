<script lang="ts">
  import {
    Timeline,
    TimelineConnector,
    TimelineDescription,
    TimelineItem,
    TimelineMarker,
    TimelineTime,
    TimelineTitle,
  } from "@ui-sdk/svelte"
  import { perfItems, perfSize } from "tests/fixtures/perf.ts"

  // A timeline with many events, each with every part, for the counts specs.
  const items = perfItems(perfSize())
</script>

<div class="fixture">
  <button>Before</button>
  <Timeline aria-label="Activity">
    {#each items as item (item.value)}
      <TimelineItem>
        <TimelineMarker />
        <TimelineConnector />
        <TimelineTitle>{item.label}</TimelineTitle>
        <TimelineTime datetime="2026-11-10">Nov 10</TimelineTime>
        <TimelineDescription>Something happened.</TimelineDescription>
      </TimelineItem>
    {/each}
  </Timeline>
  <button>After</button>
</div>
