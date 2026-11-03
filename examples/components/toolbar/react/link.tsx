"use client"

import { Toolbar, ToolbarButton, ToolbarLink, ToolbarSeparator } from "@ui-sdk/react/toolbar"
import { CheckIcon, ExternalLinkIcon, FileIcon, MessageCircleIcon } from "lucide-react"
import * as React from "react"

function Example() {
  const [page, setPage] = React.useState("conversation")
  const follow = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }
    event.preventDefault()
    setPage(event.currentTarget.hash.slice(1))
  }
  return (
    <div data-slot="stack">
      <Toolbar aria-label="Pull request">
        <ToolbarButton data-variant="secondary" aria-label="Approve">
          <CheckIcon />
        </ToolbarButton>
        <ToolbarButton data-variant="secondary" aria-label="Comment">
          <MessageCircleIcon />
        </ToolbarButton>
        <ToolbarSeparator />
        <ToolbarLink href="#files" onClick={follow}>
          <FileIcon />
          Files changed
        </ToolbarLink>
        <ToolbarLink aria-label="Checks" href="#checks" onClick={follow}>
          <ExternalLinkIcon />
        </ToolbarLink>
      </Toolbar>
      <p data-slot="hint">Showing: {page}</p>
    </div>
  )
}

export { Example }
