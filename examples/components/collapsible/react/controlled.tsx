"use client"

import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
  createCollapsibleController,
} from "@ui-sdk/react/collapsible"
import { ChevronDownIcon } from "lucide-react"
import * as React from "react"

const recoveryCodes = ["7KQ2-M9XD", "P4TR-8HZC", "W3NB-6JUE", "C5YF-2LSA"]

function Example() {
  const [collapsible] = React.useState(createCollapsibleController)
  const [open, setOpen] = React.useState(false)
  const [reason, setReason] = React.useState("")

  return (
    <div data-slot="stack">
      <Collapsible
        open={open}
        onOpenChange={(next, details) => {
          setOpen(next)
          setReason(details.reason)
        }}
        controller={collapsible}
      >
        <CollapsibleTrigger data-variant="secondary">
          Recovery codes
          <ChevronDownIcon />
        </CollapsibleTrigger>
        <CollapsiblePanel>
          <div data-slot="stack">
            <p>Each code signs you in once if you lose your phone.</p>
            <ul data-slot="log">
              {recoveryCodes.map((code) => (
                <li key={code}>{code}</li>
              ))}
            </ul>
            <button data-variant="secondary" onClick={() => collapsible.close()}>
              Done
            </button>
          </div>
        </CollapsiblePanel>
      </Collapsible>
      <button data-variant="secondary" onClick={() => collapsible.toggle()}>
        Toggle from outside
      </button>
      <output data-slot="output">
        {open ? "Open" : "Closed"}
        {reason && `, last change: ${reason}`}
      </output>
    </div>
  )
}

export { Example }
