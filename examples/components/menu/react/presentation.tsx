"use client"

import * as React from "react"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@ui-sdk/react/menu"
import { ChevronRightIcon, DownloadIcon, LinkIcon, ShareIcon, TrashIcon } from "lucide-react"

function Example() {
  const [action, setAction] = React.useState("")

  return (
    <div data-slot="stack">
      <Menu presentation="sheet" onAction={setAction}>
        <MenuTrigger>Options</MenuTrigger>
        <MenuContent>
          <MenuItem value="share">
            <ShareIcon />
            Share
          </MenuItem>
          <MenuItem value="copy-link">
            <LinkIcon />
            Copy link
          </MenuItem>
          <MenuSub>
            <MenuSubTrigger>
              <DownloadIcon />
              Move to
              <ChevronRightIcon aria-hidden="true" />
            </MenuSubTrigger>
            <MenuSubContent>
              <MenuItem value="inbox">Inbox</MenuItem>
              <MenuItem value="archive">Archive</MenuItem>
            </MenuSubContent>
          </MenuSub>
          <MenuSeparator />
          <MenuItem value="delete" destructive>
            <TrashIcon aria-hidden="true" />
            Delete
          </MenuItem>
        </MenuContent>
      </Menu>
      <output data-slot="output">{action ? `Ran ${action}` : "Opens as a sheet"}</output>
    </div>
  )
}

export { Example }
