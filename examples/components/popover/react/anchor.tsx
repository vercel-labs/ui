"use client"

import * as React from "react"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/react/popover"
import { SettingsIcon } from "lucide-react"

function Example() {
  const [anchor, setAnchor] = React.useState<HTMLInputElement | null>(null)

  return (
    <div data-slot="row">
      <input ref={setAnchor} placeholder="Search" aria-label="Search" />
      <Popover>
        <PopoverTrigger aria-label="Search filters">
          <SettingsIcon aria-hidden="true" />
        </PopoverTrigger>
        <PopoverContent anchor={anchor} align="start" sideOffset={8}>
          <PopoverTitle>Filters</PopoverTitle>
          <PopoverDescription>The popover lines up with the search field.</PopoverDescription>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export { Example }
