"use client"

import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarSeparator } from "@ui-sdk/react/toolbar"
import { CopyIcon, DownloadIcon, RedoIcon, UndoIcon } from "lucide-react"

function Example() {
  return (
    <Toolbar aria-label="Editor">
      <ToolbarGroup aria-label="Clipboard">
        <ToolbarButton data-variant="secondary" aria-label="Copy">
          <CopyIcon />
        </ToolbarButton>
        <ToolbarButton data-variant="secondary" aria-label="Download">
          <DownloadIcon />
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup disabled aria-label="History">
        <ToolbarButton data-variant="secondary" aria-label="Undo">
          <UndoIcon />
        </ToolbarButton>
        <ToolbarButton data-variant="secondary" aria-label="Redo">
          <RedoIcon />
        </ToolbarButton>
      </ToolbarGroup>
    </Toolbar>
  )
}

export { Example }
