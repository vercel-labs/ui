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
import { CircleQuestionMarkIcon } from "lucide-react"

const sides = ["top", "right", "bottom", "left"] as const
const aligns = ["start", "center", "end"] as const

function Example() {
  const [open, setOpen] = React.useState(false)
  const [side, setSide] = React.useState<(typeof sides)[number]>("bottom")
  const [align, setAlign] = React.useState<(typeof aligns)[number]>("start")
  const controls = React.useRef<HTMLDivElement>(null)

  return (
    <div data-slot="stack">
      <div data-slot="stack" ref={controls}>
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
      <Popover
        open={open}
        onOpenChange={(next, details) => {
          const target = details.event?.target
          if (!next && target instanceof Node && controls.current?.contains(target)) return details.cancel()
          setOpen(next)
        }}
      >
        <PopoverTrigger aria-label="Help">
          <CircleQuestionMarkIcon aria-hidden="true" />
        </PopoverTrigger>
        <PopoverContent side={side} align={align} sideOffset={10} arrowPadding={12}>
          <PopoverArrow />
          <PopoverTitle>Keyboard shortcuts</PopoverTitle>
          <PopoverDescription>Press ? anywhere to see every shortcut.</PopoverDescription>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export { Example }
