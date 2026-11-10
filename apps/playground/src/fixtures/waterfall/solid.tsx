import {
  createWaterfallController,
  Waterfall,
  WaterfallAxis,
  WaterfallBar,
  WaterfallCell,
  WaterfallColumnHeader,
  WaterfallHeaderRow,
  WaterfallIndicator,
  WaterfallMark,
  WaterfallRow,
  WaterfallRowHeader,
} from "@ui-sdk/solid/waterfall"
import { render } from "@solidjs/web"
import { createSignal, For, Show } from "solid-js"
import {
  describeWaterfall,
  flatWaterfall,
  waterfallFixture,
  waterfallOptions,
} from "tests/fixtures/waterfall.ts"

const controller = createWaterfallController()
const spans = flatWaterfall(waterfallFixture.items)

function Fixture() {
  const [action, setAction] = createSignal("")
  const { cancel, range: startRange, ...options } = waterfallOptions()
  const [range, setRange] = createSignal(startRange)
  return (
    <div class="fixture">
      <button>Before</button>
      <Waterfall
        aria-label={waterfallFixture.label}
        items={waterfallFixture.items}
        controller={controller}
        range={range()}
        {...options}
        onValueChange={(value) =>
          setAction(describeWaterfall("selected", value))
        }
        onExpandedChange={(expanded, details) => {
          if (
            cancel &&
            expanded.includes(cancel) &&
            !controller.isExpanded(cancel)
          ) {
            return details.cancel()
          }
          setAction(describeWaterfall("expanded", expanded))
        }}
      >
        <WaterfallHeaderRow>
          <WaterfallColumnHeader>Name</WaterfallColumnHeader>
          <WaterfallColumnHeader>Status</WaterfallColumnHeader>
          <WaterfallColumnHeader aria-label="Timeline">
            <WaterfallAxis />
            <WaterfallMark time={waterfallFixture.mark.time}>
              {waterfallFixture.mark.label}
            </WaterfallMark>
          </WaterfallColumnHeader>
        </WaterfallHeaderRow>
        <For each={spans}>
          {(span) => (
            <WaterfallRow value={span.value}>
              <WaterfallRowHeader>
                <Show when={span.children}>
                  <WaterfallIndicator />
                </Show>
                {span.label}
              </WaterfallRowHeader>
              <WaterfallCell>{span.status}</WaterfallCell>
              <WaterfallBar />
            </WaterfallRow>
          )}
        </For>
      </Waterfall>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
      <button onClick={() => controller.expandAll()}>Expand all</button>
      <button onClick={() => controller.collapseAll()}>Collapse all</button>
      <button onClick={() => controller.reveal("flags")}>Reveal flags</button>
      <button onClick={() => setRange([500, 1000])}>Zoom</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
