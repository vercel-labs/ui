import { createCollapsibleController } from "@ui-sdk/core/collapsible"
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@ui-sdk/react/collapsible"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { collapsibleFixture as fixture } from "tests/fixtures/collapsible.ts"
import { collapsibleOptions } from "tests/fixtures/page.ts"

const controller = createCollapsibleController()

function Fixture() {
  const [action, setAction] = React.useState("")
  const [reason, setReason] = React.useState("")
  const [source, setSource] = React.useState("")
  const [complete, setComplete] = React.useState("")
  const { cancel, keepMounted, hiddenUntilFound, ...options } =
    collapsibleOptions()
  return (
    <div className="fixture">
      <button>Before</button>
      <Collapsible
        className="collapsible"
        controller={controller}
        {...options}
        onOpenChange={(open, details) => {
          if (cancel === (open ? "open" : "close")) {
            return details.cancel()
          }
          setAction(open ? "open" : "closed")
          setReason(details.reason)
          setSource(details.source)
        }}
        onOpenChangeComplete={(open) => setComplete(open ? "open" : "closed")}
      >
        <CollapsibleTrigger className="collapsible-trigger">
          {fixture.trigger}
        </CollapsibleTrigger>
        <CollapsiblePanel
          className="collapsible-panel"
          keepMounted={keepMounted}
          hiddenUntilFound={hiddenUntilFound}
        >
          <p>{fixture.content}</p>
          <label>
            {fixture.field} <input />
          </label>
          <button onClick={() => controller.close()}>{fixture.close}</button>
        </CollapsiblePanel>
      </Collapsible>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
      <output aria-label="Last reason">{reason}</output>
      <output aria-label="Last source">{source}</output>
      <output aria-label="Last completed">{complete}</output>
      <button onClick={() => controller.toggle()}>{fixture.controller}</button>
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
