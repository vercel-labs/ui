<script lang="ts">
  import {
    Chronology,
    ChronologyItem,
    ChronologyTitle,
  } from "../../src/chronology"

  let { feed }: { feed: boolean } = $props()
</script>

<Chronology aria-label="Updates" {feed}>
  <ChronologyItem value="a"><ChronologyTitle>A</ChronologyTitle></ChronologyItem
  >
  <ChronologyItem value="b"><ChronologyTitle>B</ChronologyTitle></ChronologyItem
  >
</Chronology>
