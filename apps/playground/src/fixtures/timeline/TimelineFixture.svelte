<script lang="ts">
  import {
    Timeline,
    TimelineConnector,
    TimelineDescription,
    TimelineItem,
    TimelineMarker,
    TimelineTime,
    TimelineTitle,
    createTimelineController,
  } from "@ui-sdk/svelte/timeline"
  import {
    advance,
    timelineFixture as f,
    timelineOptions,
    type TimelineFixtureEvent,
  } from "tests/fixtures/timeline.ts"

  const controller = createTimelineController()
  let events = $state<readonly TimelineFixtureEvent[]>(f.events)
</script>

<div class="fixture">
  <button>Before</button>
  <Timeline
    class="timeline"
    aria-label={f.label}
    {controller}
    {...timelineOptions()}
  >
    {#each events as event (event.value)}
      <TimelineItem value={event.value} status={event.status}>
        <TimelineMarker />
        <TimelineConnector />
        <TimelineTitle>{event.title}</TimelineTitle>
        <TimelineTime datetime={event.dateTime}>{event.time}</TimelineTime>
        <TimelineDescription>{event.description}</TimelineDescription>
        {#if event.link}
          <a href={event.link.href}>{event.link.label}</a>
        {/if}
      </TimelineItem>
    {/each}
  </Timeline>
  <button>After</button>
  <button onclick={() => (events = [f.added, ...events])}>Add Event</button>
  <button onclick={() => (events = [...events].reverse())}>Reverse</button>
  <button onclick={() => controller.focus("shipped")}>Focus Current</button>
  <button onclick={() => (events = advance(events))}>Advance</button>
</div>
