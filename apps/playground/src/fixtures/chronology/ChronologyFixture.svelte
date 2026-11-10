<script lang="ts">
  import {
    Chronology,
    ChronologyConnector,
    ChronologyDescription,
    ChronologyItem,
    ChronologyMarker,
    ChronologyTime,
    ChronologyTitle,
    createChronologyController,
  } from "@ui-sdk/svelte/chronology"
  import {
    chronologyFixture as f,
    chronologyOptions,
    type ChronologyFixtureEvent,
  } from "tests/fixtures/chronology.ts"

  const controller = createChronologyController()
  let events = $state<readonly ChronologyFixtureEvent[]>(f.events)
</script>

<div class="fixture">
  <button>Before</button>
  <Chronology
    class="chronology"
    aria-label={f.label}
    {controller}
    {...chronologyOptions()}
  >
    {#each events as event (event.value)}
      <ChronologyItem value={event.value} status={event.status}>
        <ChronologyMarker />
        <ChronologyConnector />
        <ChronologyTitle>{event.title}</ChronologyTitle>
        <ChronologyTime datetime={event.dateTime}>{event.time}</ChronologyTime>
        <ChronologyDescription>{event.description}</ChronologyDescription>
        {#if event.link}
          <a href={event.link.href}>{event.link.label}</a>
        {/if}
      </ChronologyItem>
    {/each}
  </Chronology>
  <button>After</button>
  <button onclick={() => (events = [f.added, ...events])}>Add Event</button>
  <button onclick={() => (events = [...events].reverse())}>Reverse</button>
  <button onclick={() => controller.focus("shipped")}>Focus Current</button>
</div>
