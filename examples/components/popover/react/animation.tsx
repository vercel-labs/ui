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
  const [status, setStatus] = React.useState("Closed")

  return (
    <>
      <Popover
        onOpenChange={(open) => setStatus(open ? "Opening" : "Closing")}
        onOpenChangeComplete={(open) => setStatus(open ? "Open" : "Closed")}
      >
        <PopoverTrigger>Animated</PopoverTrigger>
        <PopoverContent keepMounted>
          <PopoverTitle>Scale and fade</PopoverTitle>
          <PopoverDescription>300ms in and out, from the trigger.</PopoverDescription>
        </PopoverContent>
      </Popover>
      <output data-slot="output">{status}</output>
    </>
  )
}

export { Example }
