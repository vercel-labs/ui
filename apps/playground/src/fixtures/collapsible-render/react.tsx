import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@ui-sdk/react/collapsible"
import * as React from "react"
import { createRoot } from "react-dom/client"

function Fixture() {
  const [action, setAction] = React.useState("")
  return (
    <div className="fixture">
      <button>Before</button>
      <Collapsible
        className={(state) =>
          `collapsible ${state.open ? "is-open" : "is-closed"}`
        }
        onOpenChange={(open) => setAction(open ? "open" : "closed")}
      >
        <CollapsibleTrigger
          className="collapsible-trigger"
          render={(props, state) => (
            <div {...props}>
              Files<span aria-hidden> {state.open ? "−" : "+"}</span>
            </div>
          )}
        />
        <CollapsiblePanel className="collapsible-panel" render={<section />}>
          The files panel.
        </CollapsiblePanel>
      </Collapsible>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(<Fixture />)
}

export { mount }
