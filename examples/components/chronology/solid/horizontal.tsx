import {
  Chronology,
  ChronologyConnector,
  ChronologyItem,
  ChronologyMarker,
  ChronologyTime,
  ChronologyTitle,
} from "@ui-sdk/solid/chronology"
import { For } from "solid-js"

const milestones = [
  { title: "Kickoff", dateTime: "2026-01", time: "January" },
  { title: "Design review", dateTime: "2026-03", time: "March" },
  { title: "Beta", dateTime: "2026-06", time: "June" },
  { title: "Launch", dateTime: "2026-09", time: "September" },
]

function Example() {
  return (
    <Chronology orientation="horizontal" loop={false} aria-label="Roadmap">
      <For each={milestones}>
        {(milestone) => (
          <ChronologyItem>
            <ChronologyMarker />
            <ChronologyConnector />
            <ChronologyTitle>{milestone.title}</ChronologyTitle>
            <ChronologyTime datetime={milestone.dateTime}>
              {milestone.time}
            </ChronologyTime>
          </ChronologyItem>
        )}
      </For>
    </Chronology>
  )
}

export { Example }
