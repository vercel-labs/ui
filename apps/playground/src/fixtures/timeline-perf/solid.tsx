import {
  Timeline,
  TimelineConnector,
  TimelineDescription,
  TimelineItem,
  TimelineMarker,
  TimelineTime,
  TimelineTitle,
} from "@ui-sdk/solid/timeline"
import { render } from "@solidjs/web"
import { For } from "solid-js"
import { mountWhenAsked, perfItems, perfSize } from "tests/fixtures/perf.ts"

// A timeline with many events, each with every part, for the counts specs.
const items = perfItems(perfSize())

function Fixture() {
  return (
    <div class="fixture">
      <button>Before</button>
      <Timeline aria-label="Activity">
        <For each={items}>
          {(item) => (
            <TimelineItem>
              <TimelineMarker />
              <TimelineConnector />
              <TimelineTitle>{item.label}</TimelineTitle>
              <TimelineTime datetime="2026-11-10">Nov 10</TimelineTime>
              <TimelineDescription>Something happened.</TimelineDescription>
            </TimelineItem>
          )}
        </For>
      </Timeline>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  mountWhenAsked(root, (target) => render(() => <Fixture />, target))
}

export { mount }
