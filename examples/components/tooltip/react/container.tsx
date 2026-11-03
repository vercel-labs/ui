"use client"

import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/react/tooltip"
import * as React from "react"

function Example() {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null)

  return (
    <div data-slot="stack">
      <Tooltip container={container}>
        <TooltipTrigger>Show in the box</TooltipTrigger>
        <TooltipContent>This tooltip is in the box below, in the DOM.</TooltipContent>
      </Tooltip>
      <div data-slot="card">
        Container
        <div ref={setContainer} />
      </div>
    </div>
  )
}

export { Example }
