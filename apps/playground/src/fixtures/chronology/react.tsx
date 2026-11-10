import {
  Chronology,
  ChronologyConnector,
  ChronologyDescription,
  ChronologyItem,
  ChronologyMarker,
  ChronologyTime,
  ChronologyTitle,
  createChronologyController,
} from "@ui-sdk/react/chronology"
import * as React from "react"
import { createRoot } from "react-dom/client"
import {
  advance,
  chronologyFixture as f,
  chronologyOptions,
  type ChronologyFixtureEvent,
} from "tests/fixtures/chronology.ts"

const controller = createChronologyController()

function Fixture() {
  const [events, setEvents] = React.useState<readonly ChronologyFixtureEvent[]>(
    f.events
  )
  return (
    <div className="fixture">
      <button>Before</button>
      <Chronology
        className="chronology"
        aria-label={f.label}
        controller={controller}
        {...chronologyOptions()}
      >
        {events.map((event) => (
          <ChronologyItem
            key={event.value}
            value={event.value}
            status={event.status}
          >
            <ChronologyMarker />
            <ChronologyConnector />
            <ChronologyTitle>{event.title}</ChronologyTitle>
            <ChronologyTime dateTime={event.dateTime}>
              {event.time}
            </ChronologyTime>
            <ChronologyDescription>{event.description}</ChronologyDescription>
            {event.link && <a href={event.link.href}>{event.link.label}</a>}
          </ChronologyItem>
        ))}
      </Chronology>
      <button>After</button>
      <button onClick={() => setEvents([f.added, ...events])}>Add Event</button>
      <button onClick={() => setEvents([...events].reverse())}>Reverse</button>
      <button onClick={() => controller.focus("shipped")}>Focus Current</button>
      <button onClick={() => setEvents(advance(events))}>Advance</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>
  )
}

export { Fixture, mount }
