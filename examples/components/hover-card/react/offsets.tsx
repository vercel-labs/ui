"use client"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui-sdk/react/hover-card"
import * as React from "react"

const sideOffsets = [4, 12, 24]
const alignOffsets = [-16, 0, 16]
const paddings = [8, 48]

function Example() {
  const [sideOffset, setSideOffset] = React.useState(4)
  const [alignOffset, setAlignOffset] = React.useState(0)
  const [collisionPadding, setCollisionPadding] = React.useState(8)

  return (
    <div data-slot="stack">
      <div data-slot="grid">
        <span data-slot="hint">sideOffset</span>
        <div data-slot="row" role="group" aria-label="sideOffset">
          {sideOffsets.map((value) => (
            <button
              key={value}
              type="button"
              data-size="sm"
              aria-pressed={sideOffset === value}
              onClick={() => setSideOffset(value)}
            >
              {value}
            </button>
          ))}
        </div>
        <span data-slot="hint">alignOffset</span>
        <div data-slot="row" role="group" aria-label="alignOffset">
          {alignOffsets.map((value) => (
            <button
              key={value}
              type="button"
              data-size="sm"
              aria-pressed={alignOffset === value}
              onClick={() => setAlignOffset(value)}
            >
              {value}
            </button>
          ))}
        </div>
        <span data-slot="hint">collisionPadding</span>
        <div data-slot="row" role="group" aria-label="collisionPadding">
          {paddings.map((value) => (
            <button
              key={value}
              type="button"
              data-size="sm"
              aria-pressed={collisionPadding === value}
              onClick={() => setCollisionPadding(value)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      <HoverCard>
        <HoverCardTrigger href="https://example.com/offsets">Offsets</HoverCardTrigger>
        <HoverCardContent
          align="start"
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          collisionPadding={collisionPadding}
        >
          <p>Offsets</p>
          <p data-slot="hint">
            {sideOffset}px from the link, shifted {alignOffset}px, {collisionPadding}px from the edges.
          </p>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}

export { Example }
