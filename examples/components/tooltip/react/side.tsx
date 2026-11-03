"use client"

import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/react/tooltip"

const sides = [
  { side: "left", label: "Left" },
  { side: "top", label: "Top" },
  { side: "bottom", label: "Bottom" },
  { side: "right", label: "Right" },
] as const

function Example() {
  return (
    <div data-slot="row">
      {sides.map(({ side, label }) => (
        <Tooltip key={side}>
          <TooltipTrigger>{label}</TooltipTrigger>
          <TooltipContent side={side}>Add to library</TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}

export { Example }
