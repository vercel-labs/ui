"use client"

import * as React from "react"
import { Menu, MenuContent, MenuItem, MenuItemIcon, MenuSeparator, MenuTrigger } from "@ui-sdk/react/menu"
import { DownloadIcon, LinkIcon, MailIcon, ReplyIcon, ShareIcon } from "lucide-react"

function Example() {
  const [action, setAction] = React.useState("")

  return (
    <div data-slot="stack">
      <Menu onAction={setAction}>
        <MenuTrigger>
          <ShareIcon />
          Share
        </MenuTrigger>
        <MenuContent>
          <MenuItem value="copy-link">
            <MenuItemIcon>
              <LinkIcon />
            </MenuItemIcon>
            Copy link
          </MenuItem>
          <MenuItem value="email">
            <MenuItemIcon>
              <MailIcon />
            </MenuItemIcon>
            Email
          </MenuItem>
          <MenuItem value="reply">
            <MenuItemIcon mirror>
              <ReplyIcon />
            </MenuItemIcon>
            Reply
          </MenuItem>
          <MenuSeparator />
          <MenuItem value="download">
            <MenuItemIcon>
              <DownloadIcon />
            </MenuItemIcon>
            Download
          </MenuItem>
          <MenuItem value="embed">Embed</MenuItem>
        </MenuContent>
      </Menu>
      <output data-slot="output">{action ? `Ran ${action}` : "Pick an item"}</output>
    </div>
  )
}

export { Example }
