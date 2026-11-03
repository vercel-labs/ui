"use client"

import * as React from "react"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/react/popover"

function Example() {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null)

  return (
    <div data-slot="stack">
      <Popover>
        <PopoverTrigger>Open in the box</PopoverTrigger>
        <PopoverContent container={container}>
          <PopoverTitle>Portaled</PopoverTitle>
          <PopoverDescription>This popover is in the box below, in the DOM.</PopoverDescription>
        </PopoverContent>
      </Popover>
      <div data-slot="card">
        Container
        <div ref={setContainer} />
      </div>
    </div>
  )
}

export { Example }
