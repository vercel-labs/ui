"use client"

import { Tooltip, TooltipArrow, TooltipContent, TooltipTrigger } from "@ui-sdk/react/tooltip"
import { InfoIcon } from "lucide-react"

function Example() {
  return (
    <div data-slot="row">
      <span data-slot="label">Storage</span>
      <span data-slot="hint">12.4 of 15 GB used</span>
      <Tooltip toggleable>
        <TooltipTrigger aria-label="About storage" data-size="sm">
          <InfoIcon />
        </TooltipTrigger>
        <TooltipContent sideOffset={8}>
          <TooltipArrow />
          Files in the trash count toward your storage until you empty it.
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

export { Example }
