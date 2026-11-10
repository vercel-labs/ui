<script lang="ts">
  import {
    Chronology,
    ChronologyConnector,
    ChronologyDescription,
    ChronologyItem,
    ChronologyMarker,
    ChronologyTime,
    ChronologyTitle,
  } from "@ui-sdk/svelte"
  import { perfItems, perfSize } from "tests/fixtures/perf.ts"

  // A chronology with many events, each with every part, for the counts specs.
  const items = perfItems(perfSize())
</script>

<div class="fixture">
  <button>Before</button>
  <Chronology aria-label="Activity">
    {#each items as item (item.value)}
      <ChronologyItem>
        <ChronologyMarker />
        <ChronologyConnector />
        <ChronologyTitle>{item.label}</ChronologyTitle>
        <ChronologyTime datetime="2026-11-10">Nov 10</ChronologyTime>
        <ChronologyDescription>Something happened.</ChronologyDescription>
      </ChronologyItem>
    {/each}
  </Chronology>
  <button>After</button>
</div>
