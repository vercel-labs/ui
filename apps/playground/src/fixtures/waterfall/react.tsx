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
} from "@ui-sdk/react/waterfall"
import * as React from "react"
import { createRoot } from "react-dom/client"
import {
  describeWaterfall,
  flatWaterfall,
  waterfallFixture,
  waterfallOptions,
} from "tests/fixtures/waterfall.ts"

const controller = createWaterfallController()
const spans = flatWaterfall(waterfallFixture.items)

function Fixture() {
  const [action, setAction] = React.useState("")
  const { cancel, range: startRange, ...options } = waterfallOptions()
  const [range, setRange] = React.useState(startRange)
  return (
    <div className="fixture">
      <button>Before</button>
      <Waterfall
        aria-label={waterfallFixture.label}
        items={waterfallFixture.items}
        controller={controller}
        range={range}
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
        {spans.map((span) => (
          <WaterfallRow key={span.value} value={span.value}>
            <WaterfallRowHeader>
              {span.children && <WaterfallIndicator />}
              {span.label}
            </WaterfallRowHeader>
            <WaterfallCell>{span.status}</WaterfallCell>
            <WaterfallBar />
          </WaterfallRow>
        ))}
      </Waterfall>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
      <button onClick={() => controller.expandAll()}>Expand all</button>
      <button onClick={() => controller.collapseAll()}>Collapse all</button>
      <button onClick={() => controller.reveal("flags")}>Reveal flags</button>
      <button onClick={() => setRange([500, 1000])}>Zoom</button>
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
