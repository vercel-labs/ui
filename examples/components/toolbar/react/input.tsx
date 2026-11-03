"use client"

import { NumberInput, NumberInputControl } from "@ui-sdk/react/number-input"
import { Toolbar, ToolbarButton, ToolbarInput } from "@ui-sdk/react/toolbar"
import { BoldIcon, SearchIcon } from "lucide-react"

function Example() {
  return (
    <Toolbar aria-label="Text">
      <ToolbarButton data-variant="secondary" aria-label="Bold">
        <BoldIcon />
      </ToolbarButton>
      <NumberInput defaultValue={14} min={8} max={72}>
        <ToolbarInput render={<NumberInputControl aria-label="Font size" />} />
      </NumberInput>
      <ToolbarInput aria-label="Find" placeholder="Find…" />
      <ToolbarButton data-variant="secondary" aria-label="Search">
        <SearchIcon />
      </ToolbarButton>
    </Toolbar>
  )
}

export { Example }
