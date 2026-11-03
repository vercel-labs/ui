"use client"

import { Toggle, ToggleGroup } from "@ui-sdk/react/toggle"
import { Toolbar, ToolbarButton, ToolbarSeparator } from "@ui-sdk/react/toolbar"
import { ImageIcon, MoveHorizontalIcon, PencilIcon, TrashIcon } from "lucide-react"

function Example() {
  return (
    <Toolbar orientation="vertical" aria-label="Tools">
      <ToggleGroup defaultValue={["pencil"]} aria-label="Tool" orientation="vertical">
        <Toggle data-variant="ghost" value="pencil" aria-label="Pencil">
          <PencilIcon />
        </Toggle>
        <Toggle data-variant="ghost" value="image" aria-label="Image">
          <ImageIcon />
        </Toggle>
        <Toggle data-variant="ghost" value="move" aria-label="Move">
          <MoveHorizontalIcon />
        </Toggle>
      </ToggleGroup>
      <ToolbarSeparator />
      <ToolbarButton data-variant="secondary" aria-label="Delete">
        <TrashIcon />
      </ToolbarButton>
    </Toolbar>
  )
}

export { Example }
