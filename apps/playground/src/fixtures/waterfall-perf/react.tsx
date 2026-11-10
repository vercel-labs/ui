import {
  Waterfall,
  WaterfallBar,
  WaterfallCell,
  WaterfallIndicator,
  WaterfallRow,
  WaterfallRowHeader,
} from "@ui-sdk/react/waterfall"
import { createRoot } from "react-dom/client"
import { countRender, mountWhenAsked, perfSize } from "tests/fixtures/perf.ts"
import { flatWaterfall, longTrace } from "tests/fixtures/waterfall.ts"

// A trace of N requests of two spans each, every row rendered, for the count
// gates. Every request starts collapsed, so its spans render hidden.
const trace = longTrace(perfSize(200))
const spans = flatWaterfall(trace)

function Fixture() {
  return (
    <div className="fixture">
      <button>Before</button>
      <Waterfall aria-label="Long trace" items={trace}>
        {spans.map((span) => (
          <WaterfallRow
            key={span.value}
            value={span.value}
            render={(props) => {
              countRender("row")
              return <div {...props} />
            }}
          >
            <WaterfallRowHeader>
              {span.children && <WaterfallIndicator />}
              {span.label}
            </WaterfallRowHeader>
            <WaterfallCell>{span.status}</WaterfallCell>
            <WaterfallBar
              render={(props) => {
                countRender("bar")
                return <div {...props} />
              }}
            />
          </WaterfallRow>
        ))}
      </Waterfall>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  mountWhenAsked(root, (target) => createRoot(target).render(<Fixture />))
}

export { mount }
