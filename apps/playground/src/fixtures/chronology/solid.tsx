import {
  Chronology,
  ChronologyConnector,
  ChronologyDescription,
  ChronologyItem,
  ChronologyMarker,
  ChronologyTime,
  ChronologyTitle,
  createChronologyController,
} from "@ui-sdk/solid/chronology"
import { render } from "@solidjs/web"
import { createSignal, For, Show } from "solid-js"
import {
  advance,
  chronologyFixture as f,
  chronologyOptions,
  type ChronologyFixtureEvent,
} from "tests/fixtures/chronology.ts"

const controller = createChronologyController()

function Fixture() {
  const [events, setEvents] = createSignal<readonly ChronologyFixtureEvent[]>(
    f.events
  )
  return (
    <div class="fixture">
      <button>Before</button>
      <Chronology
        class="chronology"
        aria-label={f.label}
        controller={controller}
        {...chronologyOptions()}
      >
        <For each={events()} keyed={(event) => event.value}>
          {(event) => (
            <ChronologyItem value={event().value} status={event().status}>
              <ChronologyMarker />
              <ChronologyConnector />
              <ChronologyTitle>{event().title}</ChronologyTitle>
              <ChronologyTime datetime={event().dateTime}>
                {event().time}
              </ChronologyTime>
              <ChronologyDescription>
                {event().description}
              </ChronologyDescription>
              <Show when={event().link}>
                {(link) => <a href={link().href}>{link().label}</a>}
              </Show>
            </ChronologyItem>
          )}
        </For>
      </Chronology>
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
