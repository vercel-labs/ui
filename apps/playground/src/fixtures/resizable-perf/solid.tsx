import {
  Resizable,
  ResizableHandle,
  ResizablePanel,
} from "@ui-sdk/solid/resizable"
import { render } from "@solidjs/web"
import { For, untrack } from "solid-js"
import { countRender, perfItems, perfSize } from "tests/fixtures/perf.ts"

// A group of N panels for the counts specs. The first two take
// a quarter each and the rest share the other half, so the first handle has
// room to move. Every other panel reads its size in its render function, so
// specs can tell plain panels' renders from watched ones. The second panel,
// which the first handle resizes, is a watched one.
const panels = perfItems(perfSize())

function Fixture() {
  return (
    <div class="fixture">
      <button>Before</button>
      <Resizable class="resizable-perf">
        <For each={panels}>
          {(panel, index) => {
            // The list never reorders, so a row reads its place once and
            // renders plain elements, which its group inserts without
            // tracking each row.
            const at = untrack(index)
            const handle =
              at > 0 ? (
                <ResizableHandle
                  class="resizable-perf-handle"
                  aria-label={`Handle ${at}`}
                  render={(props) => {
                    countRender("handle")
                    return <div {...props} />
                  }}
                />
              ) : null
            const size = at < 2 ? 25 : undefined
            const item =
              at % 2 ? (
                <ResizablePanel
                  id={panel.value}
                  defaultSize={size}
                  class="resizable-panel"
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
                  defaultSize={size}
                  class="resizable-panel"
                  render={(props) => {
                    countRender("plain")
                    return <div {...props}>{panel.label}</div>
                  }}
                />
              )
            return [handle, item]
          }}
        </For>
      </Resizable>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { mount }
