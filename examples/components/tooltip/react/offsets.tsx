"use client"

import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/react/tooltip"
import * as React from "react"

const aligns = ["start", "center", "end"] as const
const sideOffsets = [4, 12, 24]
const alignOffsets = [-16, 0, 16]
const paddings = [8, 48]

function Example() {
  const [align, setAlign] = React.useState<(typeof aligns)[number]>("start")
  const [sideOffset, setSideOffset] = React.useState(4)
  const [alignOffset, setAlignOffset] = React.useState(0)
  const [collisionPadding, setCollisionPadding] = React.useState(8)

  return (
    <div data-slot="stack">
      <div data-slot="grid">
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
      <Tooltip>
        <TooltipTrigger>Offsets</TooltipTrigger>
        <TooltipContent
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          collisionPadding={collisionPadding}
        >
          {align}, {sideOffset}px away, shifted {alignOffset}px
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

export { Example }
