"use client"

import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/react/tooltip"
import { BoldIcon, ItalicIcon, Share2Icon, UnderlineIcon } from "lucide-react"

const formats = [
  { icon: BoldIcon, label: "Bold" },
  { icon: ItalicIcon, label: "Italic" },
  { icon: UnderlineIcon, label: "Underline" },
]

function Example() {
  return (
    <div data-slot="row">
      {formats.map((format) => (
        <Tooltip key={format.label}>
          <TooltipTrigger>
            <format.icon />
          </TooltipTrigger>
          <TooltipContent>{format.label}</TooltipContent>
        </Tooltip>
      ))}
      <Tooltip type="label">
        <TooltipTrigger>¶</TooltipTrigger>
        <TooltipContent>Show formatting marks</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <Share2Icon />
          Share
        </TooltipTrigger>
        <TooltipContent>Anyone with the link can view</TooltipContent>
      </Tooltip>
    </div>
  )
}

export { Example }
