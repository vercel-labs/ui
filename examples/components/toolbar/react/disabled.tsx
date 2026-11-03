"use client"

import { Toolbar, ToolbarButton, ToolbarInput } from "@ui-sdk/react/toolbar"
import { ArchiveIcon, MailIcon, TrashIcon } from "lucide-react"

function Example() {
  return (
    <div data-slot="stack">
      <Toolbar aria-label="Message">
        <ToolbarButton data-variant="secondary">
          <MailIcon />
          Reply
        </ToolbarButton>
        <ToolbarButton data-variant="secondary" disabled>
          <ArchiveIcon />
          Archive
        </ToolbarButton>
        <ToolbarButton data-variant="secondary" aria-label="Delete" disabled focusableWhenDisabled={false}>
          <TrashIcon />
        </ToolbarButton>
      </Toolbar>
      <Toolbar disabled aria-label="Comment">
        <ToolbarInput aria-label="Comment" defaultValue="Read only for now" />
        <ToolbarButton data-variant="secondary">Send</ToolbarButton>
      </Toolbar>
    </div>
  )
}

export { Example }
