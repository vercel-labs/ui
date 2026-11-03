"use client"

import { HoverCard, HoverCardArrow, HoverCardContent, HoverCardTrigger } from "@ui-sdk/react/hover-card"
import * as React from "react"

const sides = ["top", "right", "bottom", "left"] as const
const aligns = ["start", "center", "end"] as const
const alan = {
  handle: "alan",
  name: "Alan Turing",
  bio: "Described the universal machine every computer descends from.",
}

function Example() {
  const [side, setSide] = React.useState<(typeof sides)[number]>("bottom")
  const [align, setAlign] = React.useState<(typeof aligns)[number]>("center")

  return (
    <div data-slot="stack">
      <div data-slot="grid">
        <span data-slot="hint">side</span>
        <div data-slot="row" role="group" aria-label="side">
          {sides.map((value) => (
            <button
              key={value}
              type="button"
              data-size="sm"
              aria-pressed={side === value}
              onClick={() => setSide(value)}
            >
              {value}
            </button>
          ))}
        </div>
        <span data-slot="hint">align</span>
        <div data-slot="row" role="group" aria-label="align">
          {aligns.map((value) => (
            <button
              key={value}
              type="button"
              data-size="sm"
              aria-pressed={align === value}
              onClick={() => setAlign(value)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      <HoverCard>
        <HoverCardTrigger href="https://example.com/people/alan">@{alan.handle}</HoverCardTrigger>
        <HoverCardContent side={side} align={align} sideOffset={10} arrowPadding={12}>
          <HoverCardArrow />
          <p>{alan.name}</p>
          <p>{alan.bio}</p>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}

export { Example }
