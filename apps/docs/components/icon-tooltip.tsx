"use client"

import {
  createTooltipController,
  Tooltip,
  TooltipContent,
} from "@/components/ui/tooltip"

// The docs' icon buttons, like Copy and Reset, share one tooltip, so a long page
// sets up one instead of dozens. Each trigger passes its label as the payload.
const iconTooltip = createTooltipController<string>()

function IconTooltip() {
  return (
    <div className="contents">
      <Tooltip controller={iconTooltip}>
        <TooltipContent>
          {({ payload }) => String(payload ?? "")}
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

export { IconTooltip, iconTooltip }
