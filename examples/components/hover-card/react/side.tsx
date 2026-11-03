"use client"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui-sdk/react/hover-card"

const sides = ["left", "top", "bottom", "right"] as const

function Example() {
  return (
    <div data-slot="row">
      {sides.map((side) => (
        <HoverCard key={side}>
          <HoverCardTrigger href={`https://example.com/${side}`}>{side}</HoverCardTrigger>
          <HoverCardContent side={side}>
            <p>{side}</p>
            <p data-slot="hint">The card opens on this side of the link.</p>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  )
}

export { Example }
