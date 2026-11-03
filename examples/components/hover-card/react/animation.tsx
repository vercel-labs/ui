"use client"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui-sdk/react/hover-card"
import * as React from "react"

const grace = {
  handle: "grace",
  name: "Grace Hopper",
  bio: "Built the first compiler and popularized the word “debugging”.",
}

function Example() {
  const [status, setStatus] = React.useState("Closed")

  return (
    <div data-slot="stack">
      <HoverCard
        onOpenChange={(open) => setStatus(open ? "Opening" : "Closing")}
        onOpenChangeComplete={(open) => setStatus(open ? "Open" : "Closed")}
      >
        <HoverCardTrigger href="https://example.com/people/grace">@{grace.handle}</HoverCardTrigger>
        <HoverCardContent keepMounted>
          <p>{grace.name}</p>
          <p>{grace.bio}</p>
        </HoverCardContent>
      </HoverCard>
      <output data-slot="output">{status}</output>
    </div>
  )
}

export { Example }
