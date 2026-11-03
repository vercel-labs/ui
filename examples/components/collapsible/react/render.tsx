"use client"

import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/react/collapsible"
import { ChevronRightIcon } from "lucide-react"

function Example() {
  return (
    <Collapsible>
      <CollapsibleTrigger
        data-variant="secondary"
        render={(props, state) => (
          <h3>
            <button {...props} />
            <span data-slot="hint">{state.open ? "3 updates" : "Arrives Thursday"}</span>
          </h3>
        )}
      >
        <ChevronRightIcon />
        <span>Track parcel</span>
      </CollapsibleTrigger>
      <CollapsiblePanel render={<ol />}>
        <li data-slot="row">
          Out for delivery <span>07:40</span>
        </li>
        <li data-slot="row">
          Arrived at the local depot <span>05:12</span>
        </li>
        <li data-slot="row">
          Left the sorting center <span>Wed 21:03</span>
        </li>
      </CollapsiblePanel>
    </Collapsible>
  )
}

export { Example }
