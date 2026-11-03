"use client"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui-sdk/react/hover-card"
import * as React from "react"

const timings = [
  { label: "Instant", delay: 0, closeDelay: 0 },
  { label: "Default", delay: 600, closeDelay: 300 },
  { label: "Patient", delay: 1200, closeDelay: 600 },
]

function Example() {
  const [enabled, setEnabled] = React.useState(true)

  return (
    <div data-slot="stack">
      <div data-slot="row">
        {timings.map((timing) => (
          <HoverCard
            key={timing.label}
            delay={timing.delay}
            closeDelay={timing.closeDelay}
            disabled={!enabled}
          >
            <HoverCardTrigger href={`https://example.com/${timing.label.toLowerCase()}`}>
              {timing.label}
            </HoverCardTrigger>
            <HoverCardContent>
              <p>{timing.label}</p>
              <p data-slot="hint">
                Opens after {timing.delay}ms and closes {timing.closeDelay}ms after the pointer leaves.
              </p>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
      <label data-slot="label">
        <input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} />
        Show cards
      </label>
    </div>
  )
}

export { Example }
