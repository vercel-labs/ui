import {
  Timeline,
  TimelineConnector,
  TimelineDescription,
  TimelineItem,
  TimelineMarker,
  TimelineTime,
  TimelineTitle,
} from "@ui-sdk/react/timeline"
import { createRoot } from "react-dom/client"
import { mountWhenAsked, perfItems, perfSize } from "tests/fixtures/perf.ts"

// A timeline with many events, each with every part, for the counts specs.
const items = perfItems(perfSize())

function Fixture() {
  return (
    <div className="fixture">
      <button>Before</button>
      <Timeline aria-label="Activity">
        {items.map((item) => (
          <TimelineItem key={item.value}>
            <TimelineMarker />
            <TimelineConnector />
            <TimelineTitle>{item.label}</TimelineTitle>
            <TimelineTime dateTime="2026-11-10">Nov 10</TimelineTime>
            <TimelineDescription>Something happened.</TimelineDescription>
          </TimelineItem>
        ))}
      </Timeline>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  mountWhenAsked(root, (target) => createRoot(target).render(<Fixture />))
}

export { mount }
