"use client"

import { Tooltip, TooltipArrow, TooltipContent, TooltipTrigger } from "@ui-sdk/react/tooltip"
import { CircleQuestionMarkIcon } from "lucide-react"
import * as React from "react"

const sides = ["top", "right", "bottom", "left"] as const
const aligns = ["start", "center", "end"] as const

function Example() {
  const [open, setOpen] = React.useState(false)
  const [pinned, setPinned] = React.useState(false)
  const [side, setSide] = React.useState<(typeof sides)[number]>("top")
  const [align, setAlign] = React.useState<(typeof aligns)[number]>("center")

  return (
    <div data-slot="stack">
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
        <label data-slot="label">
          <input type="checkbox" checked={pinned} onChange={(event) => setPinned(event.target.checked)} />
          Keep open
        </label>
      </div>
      <Tooltip
        open={pinned || open}
        onOpenChange={(next, details) => {
          setOpen(next)
          if (!next && pinned) {
            details.cancel()
          }
        }}
      >
        <TooltipTrigger>
          <CircleQuestionMarkIcon />
        </TooltipTrigger>
        <TooltipContent side={side} align={align} sideOffset={8} arrowPadding={8}>
          <TooltipArrow />
          Keyboard shortcuts
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

export { Example }
