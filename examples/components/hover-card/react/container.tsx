"use client"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui-sdk/react/hover-card"
import * as React from "react"

function Example() {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null)

  return (
    <div data-slot="stack">
      <HoverCard>
        <HoverCardTrigger href="https://example.com/box">Show in the box</HoverCardTrigger>
        <HoverCardContent container={container}>
          <p>Portaled</p>
          <p data-slot="hint">This card is in the box below, in the DOM.</p>
        </HoverCardContent>
      </HoverCard>
      <div data-slot="card">
        Container
        <div ref={setContainer} />
      </div>
    </div>
  )
}

export { Example }
