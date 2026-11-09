import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@ui-sdk/solid/collapsible"
import { render } from "@solidjs/web"
import { createSignal } from "solid-js"

function Fixture() {
  const [action, setAction] = createSignal("")
  return (
    <div class="fixture">
      <button>Before</button>
      <Collapsible
        class={(state) => `collapsible ${state.open ? "is-open" : "is-closed"}`}
        onOpenChange={(open) => setAction(open ? "open" : "closed")}
      >
        <CollapsibleTrigger
          class="collapsible-trigger"
          render={(props, state) => (
            <div {...props}>
              Files<span aria-hidden="true"> {state.open ? "−" : "+"}</span>
            </div>
          )}
        />
        <CollapsiblePanel
          class="collapsible-panel"
          render={(props) => <section {...props} />}
        >
          The files panel.
        </CollapsiblePanel>
      </Collapsible>
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

export { mount }
