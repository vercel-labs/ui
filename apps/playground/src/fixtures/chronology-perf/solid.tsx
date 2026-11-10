import {
  Chronology,
  ChronologyConnector,
  ChronologyDescription,
  ChronologyItem,
  ChronologyMarker,
  ChronologyTime,
  ChronologyTitle,
} from "@ui-sdk/solid/chronology"
import { render } from "@solidjs/web"
import { For } from "solid-js"
import { mountWhenAsked, perfItems, perfSize } from "tests/fixtures/perf.ts"

// A chronology with many events, each with every part, for the counts specs.
const items = perfItems(perfSize())

function Fixture() {
  return (
    <div class="fixture">
      <button>Before</button>
      <Chronology aria-label="Activity">
        <For each={items}>
          {(item) => (
            <ChronologyItem>
              <ChronologyMarker />
              <ChronologyConnector />
              <ChronologyTitle>{item.label}</ChronologyTitle>
              <ChronologyTime datetime="2026-11-10">Nov 10</ChronologyTime>
              <ChronologyDescription>Something happened.</ChronologyDescription>
            </ChronologyItem>
          )}
        </For>
      </Chronology>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  mountWhenAsked(root, (target) => render(() => <Fixture />, target))
}

export { mount }
