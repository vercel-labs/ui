"use client"

import * as React from "react"
import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/react/popover"

const sides = ["top", "right", "bottom", "left"] as const
const aligns = ["start", "center", "end"] as const

function Example() {
  const [sideOffset, setSideOffset] = React.useState(8)
  const [alignOffset, setAlignOffset] = React.useState(0)
  const [collisionPadding, setCollisionPadding] = React.useState(8)

  const [side, setSide] = React.useState<(typeof sides)[number]>("bottom")
  const [align, setAlign] = React.useState<(typeof aligns)[number]>("center")

  return (
    <div data-slot="stack">
      <div data-slot="stack">
        <div data-slot="row" role="group" aria-label="Side">
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
        <div data-slot="row" role="group" aria-label="Align">
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
      <div data-slot="stack">
        <label data-slot="label">
          Side offset<span data-slot="hint">{sideOffset}px</span>
          <input
            type="range"
            min={0}
            max={32}
            value={sideOffset}
            onChange={(event) => setSideOffset(Number(event.currentTarget.value))}
          />
        </label>
        <label data-slot="label">
          Align offset<span data-slot="hint">{alignOffset}px</span>
          <input
            type="range"
            min={-24}
            max={24}
            value={alignOffset}
            onChange={(event) => setAlignOffset(Number(event.currentTarget.value))}
          />
        </label>
        <label data-slot="label">
          Collision padding<span data-slot="hint">{collisionPadding}px</span>
          <input
            type="range"
            min={0}
            max={48}
            value={collisionPadding}
            onChange={(event) => setCollisionPadding(Number(event.currentTarget.value))}
          />
        </label>
      </div>
      <Popover>
        <PopoverTrigger>Placement</PopoverTrigger>
        <PopoverContent
          side={side}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          collisionPadding={collisionPadding}
        >
          <PopoverArrow />
          <PopoverTitle>
            {side} {align}
          </PopoverTitle>
          <PopoverDescription>Choose a side, alignment, and offsets above.</PopoverDescription>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export { Example }
