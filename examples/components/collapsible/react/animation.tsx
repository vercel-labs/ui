"use client"

import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/react/collapsible"
import { ChevronDownIcon } from "lucide-react"
import * as React from "react"

const notes = [
  "Search now matches file contents, not only names.",
  "Shared links remember the folder they were opened from.",
  "Uploads resume after the connection drops.",
]

function Example() {
  const [settled, setSettled] = React.useState("")
  return (
    <div>
      <Collapsible onOpenChangeComplete={(open) => setSettled(open ? "opening" : "closing")}>
        <CollapsibleTrigger data-variant="secondary">
          Release notes
          <ChevronDownIcon />
        </CollapsibleTrigger>
        <CollapsiblePanel>
          <ul>
            {notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </CollapsiblePanel>
      </Collapsible>
      <output data-slot="output">{settled ? `Finished ${settled}` : "Not animated yet"}</output>
    </div>
  )
}

export { Example }
