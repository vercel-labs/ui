import {
  Timeline,
  TimelineConnector,
  TimelineDescription,
  TimelineItem,
  TimelineMarker,
  TimelineTime,
  TimelineTitle,
  createTimelineController,
} from "@ui-sdk/solid/timeline"
import { render } from "@solidjs/web"
import { createSignal, For, Show } from "solid-js"
import {
  advance,
  timelineFixture as f,
  timelineOptions,
  type TimelineFixtureEvent,
} from "tests/fixtures/timeline.ts"

const controller = createTimelineController()

function Fixture() {
  const [events, setEvents] = createSignal<readonly TimelineFixtureEvent[]>(
    f.events
  )
  return (
    <div class="fixture">
      <button>Before</button>
      <Timeline
        class="timeline"
        aria-label={f.label}
        controller={controller}
        {...timelineOptions()}
      >
        <For each={events()} keyed={(event) => event.value}>
          {(event) => (
            <TimelineItem value={event().value} status={event().status}>
              <TimelineMarker />
              <TimelineConnector />
              <TimelineTitle>{event().title}</TimelineTitle>
              <TimelineTime datetime={event().dateTime}>
                {event().time}
              </TimelineTime>
              <TimelineDescription>{event().description}</TimelineDescription>
              <Show when={event().link}>
                {(link) => <a href={link().href}>{link().label}</a>}
              </Show>
            </TimelineItem>
          )}
        </For>
      </Timeline>
      <button>After</button>
      <button onClick={() => setEvents([f.added, ...events()])}>
        Add Event
      </button>
      <button onClick={() => setEvents([...events()].reverse())}>
        Reverse
      </button>
      <button onClick={() => controller.focus("shipped")}>Focus Current</button>
      <button onClick={() => setEvents(advance(events()))}>Advance</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
