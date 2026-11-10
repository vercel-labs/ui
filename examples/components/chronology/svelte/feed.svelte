<script lang="ts">
  import {
    Chronology,
    ChronologyConnector,
    ChronologyDescription,
    ChronologyItem,
    ChronologyMarker,
    ChronologyTime,
    ChronologyTitle,
  } from "@ui-sdk/svelte/chronology"
  import { useLog } from "../../../shared/svelte/log"

  const updates = [
    {
      id: 1,
      author: "Ada",
      date: "2026-11-10",
      time: "Nov 10",
      text: "Shipped the new onboarding flow.",
    },
    {
      id: 2,
      author: "Grace",
      date: "2026-11-10",
      time: "Nov 10",
      text: "Fixed the flaky upload test.",
    },
    {
      id: 3,
      author: "Linus",
      date: "2026-11-09",
      time: "Nov 9",
      text: "Moved the docs to the new theme.",
    },
    {
      id: 4,
      author: "Margaret",
      date: "2026-11-09",
      time: "Nov 9",
      text: "Wrote the launch checklist.",
    },
    {
      id: 5,
      author: "Ada",
      date: "2026-11-08",
      time: "Nov 8",
      text: "Cut search latency in half.",
    },
    {
      id: 6,
      author: "Grace",
      date: "2026-11-07",
      time: "Nov 7",
      text: "Added keyboard shortcuts to the editor.",
    },
    {
      id: 7,
      author: "Linus",
      date: "2026-11-06",
      time: "Nov 6",
      text: "Cleaned up the old billing code.",
    },
    {
      id: 8,
      author: "Margaret",
      date: "2026-11-05",
      time: "Nov 5",
      text: "Ran the accessibility review.",
    },
    {
      id: 9,
      author: "Ada",
      date: "2026-11-04",
      time: "Nov 4",
      text: "Started the mobile layout.",
    },
  ]

  const pageSize = 3
  const log = useLog()
  let count = $state(pageSize)
  let busy = $state(false)

  function loadMore() {
    busy = true
    setTimeout(() => {
      count += pageSize
      busy = false
      log(`Loaded ${pageSize} more updates`)
    }, 600)
  }
</script>

<div data-slot="stack">
  <div data-slot="controls">
    <button
      type="button"
      disabled={busy || count >= updates.length}
      onclick={loadMore}
    >
      {busy ? "Loading…" : "Load More"}
    </button>
  </div>
  <Chronology feed {busy} aria-label="Team updates">
    {#each updates.slice(0, count) as update (update.id)}
      <ChronologyItem>
        <ChronologyMarker />
        <ChronologyConnector />
        <ChronologyTitle>{update.author}</ChronologyTitle>
        <ChronologyTime datetime={update.date}>{update.time}</ChronologyTime>
        <ChronologyDescription>{update.text}</ChronologyDescription>
      </ChronologyItem>
    {/each}
  </Chronology>
</div>
