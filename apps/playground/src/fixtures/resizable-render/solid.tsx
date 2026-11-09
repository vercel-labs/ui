import {
  Resizable,
  ResizableHandle,
  ResizablePanel,
} from "@ui-sdk/solid/resizable"
import { render } from "@solidjs/web"
import { createSignal } from "solid-js"

// How often the first panel's children rendered, for specs that check a drag
// renders nothing that doesn't read the size.
const counts = { renders: 0 }
Object.assign(window, { panelRenders: counts })

function Fixture() {
  const [action, setAction] = createSignal("")
  return (
    <div class="fixture">
      <button>Before</button>
      <Resizable
        class="resizable"
        onLayoutCommit={(layout) =>
          setAction(`layout:${layout.map(Math.round)}`)
        }
      >
        <ResizablePanel
          defaultSize={30}
          collapsible
          minSize={10}
          class="resizable-panel"
          role="group"
          aria-label="Files"
        >
          {(state) => {
            counts.renders++
            return (
              <span class="panel-state">
                {state.collapsed ? "Collapsed" : "Open"}
              </span>
            )
          }}
        </ResizablePanel>
        <ResizableHandle
          render={(props) => <span {...props} />}
          aria-label="Resize files"
          class={(state) =>
            `resizable-handle ${state.dragging ? "is-dragging" : "is-idle"}`
          }
        />
        <ResizablePanel
          class="resizable-panel"
          role="group"
          aria-label="Editor"
        >
          {(state) => <span class="panel-size">{Math.round(state.size)}</span>}
        </ResizablePanel>
      </Resizable>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
