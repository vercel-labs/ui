import {
  Resizable,
  ResizableHandle,
  ResizablePanel,
} from "@ui-sdk/react/resizable"
import { Fragment } from "react"
import { createRoot } from "react-dom/client"
import { countRender, perfItems, perfSize } from "tests/fixtures/perf.ts"

// A group of N panels for the counts specs. The first two take
// a quarter each and the rest share the other half, so the first handle has
// room to move. Every other panel reads its size in its render function, so
// specs can tell plain panels' renders from watched ones. The second panel,
// which the first handle resizes, is a watched one.
const panels = perfItems(perfSize())

function Fixture() {
  return (
    <div className="fixture">
      <button>Before</button>
      <Resizable className="resizable-perf">
        {panels.map((panel, index) => (
          <Fragment key={panel.value}>
            {index > 0 && (
              <ResizableHandle
                className="resizable-perf-handle"
                aria-label={`Handle ${index}`}
                render={(props) => {
                  countRender("handle")
                  return <div {...props} />
                }}
              />
            )}
            {index % 2 ? (
              <ResizablePanel
                id={panel.value}
                defaultSize={index < 2 ? 25 : undefined}
                className="resizable-panel"
                render={(props, state) => {
                  countRender("watched")
                  return (
                    <div {...props} data-size={Math.round(state.size)}>
                      {panel.label}
                    </div>
                  )
                }}
              />
            ) : (
              <ResizablePanel
                id={panel.value}
                defaultSize={index < 2 ? 25 : undefined}
                className="resizable-panel"
                render={(props) => {
                  countRender("plain")
                  return <div {...props}>{panel.label}</div>
                }}
              />
            )}
          </Fragment>
        ))}
      </Resizable>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(<Fixture />)
}

export { mount }
