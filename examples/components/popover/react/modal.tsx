"use client"

import * as React from "react"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/react/popover"

const modes = [
  { label: "Non-modal", modal: false },
  { label: "Trap focus", modal: "trap-focus" },
  { label: "Modal", modal: true },
] as const

function Example() {
  const [clicks, setClicks] = React.useState(0)

  return (
    <div data-slot="stack">
      <div data-slot="row">
        {modes.map((mode) => (
          <Popover key={mode.label} modal={mode.modal}>
            <PopoverTrigger>{mode.label}</PopoverTrigger>
            <PopoverContent>
              <PopoverTitle>{mode.label}</PopoverTitle>
              <PopoverDescription>Press Tab, then click the box below.</PopoverDescription>
              <PopoverClose>Close</PopoverClose>
            </PopoverContent>
          </Popover>
        ))}
      </div>
      <button type="button" onClick={() => setClicks(clicks + 1)}>
        Clicked {clicks} {clicks === 1 ? "time" : "times"}. Open a popover, then click here.
      </button>
    </div>
  )
}

export { Example }
