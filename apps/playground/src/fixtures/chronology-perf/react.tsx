import {
  Chronology,
  ChronologyConnector,
  ChronologyDescription,
  ChronologyItem,
  ChronologyMarker,
  ChronologyTime,
  ChronologyTitle,
} from "@ui-sdk/react/chronology"
import { createRoot } from "react-dom/client"
import { mountWhenAsked, perfItems, perfSize } from "tests/fixtures/perf.ts"

// A chronology with many events, each with every part, for the counts specs.
const items = perfItems(perfSize())

function Fixture() {
  return (
    <div className="fixture">
      <button>Before</button>
      <Chronology aria-label="Activity">
        {items.map((item) => (
          <ChronologyItem key={item.value}>
            <ChronologyMarker />
            <ChronologyConnector />
            <ChronologyTitle>{item.label}</ChronologyTitle>
            <ChronologyTime dateTime="2026-11-10">Nov 10</ChronologyTime>
            <ChronologyDescription>Something happened.</ChronologyDescription>
          </ChronologyItem>
        ))}
      </Chronology>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  mountWhenAsked(root, (target) => createRoot(target).render(<Fixture />))
}

export { mount }
