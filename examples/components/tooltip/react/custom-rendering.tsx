"use client"

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/react/popover"
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/react/tooltip"
import { BellIcon, ExternalLinkIcon } from "lucide-react"

function Example() {
  return (
    <div data-slot="row">
      <Popover>
        <Tooltip>
          <TooltipTrigger render={<PopoverTrigger />}>
            <BellIcon />
          </TooltipTrigger>
          <TooltipContent>Notifications</TooltipContent>
        </Tooltip>
        <PopoverContent sideOffset={8}>
          <PopoverTitle>Notifications</PopoverTitle>
          <PopoverDescription>You're all caught up.</PopoverDescription>
        </PopoverContent>
      </Popover>
      <Tooltip>
        <TooltipTrigger data-variant="link" render={<a href="https://example.com/changelog" />}>
          Changelog
          <ExternalLinkIcon />
        </TooltipTrigger>
        <TooltipContent>What's new in 2.0</TooltipContent>
      </Tooltip>
    </div>
  )
}

export { Example }
