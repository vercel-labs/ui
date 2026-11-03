"use client"

import { Menu, MenuContent, MenuItem, MenuItemIcon, MenuTrigger } from "@ui-sdk/react/menu"
import { Toolbar, ToolbarButton } from "@ui-sdk/react/toolbar"
import { LinkIcon, MailIcon, SaveIcon, ShareIcon } from "lucide-react"
import * as React from "react"

function Example() {
  const [action, setAction] = React.useState("nothing yet")
  return (
    <div data-slot="stack">
      <Toolbar aria-label="Document">
        <ToolbarButton data-variant="secondary" onClick={() => setAction("save")}>
          <SaveIcon />
          Save
        </ToolbarButton>
        <Menu onAction={setAction}>
          <ToolbarButton data-variant="secondary" render={<MenuTrigger />}>
            <ShareIcon />
            Share
          </ToolbarButton>
          <MenuContent>
            <MenuItem value="email">
              <MenuItemIcon>
                <MailIcon />
              </MenuItemIcon>
              Email
            </MenuItem>
            <MenuItem value="link">
              <MenuItemIcon>
                <LinkIcon />
              </MenuItemIcon>
              Copy link
            </MenuItem>
          </MenuContent>
        </Menu>
        <ToolbarButton data-variant="secondary" onClick={() => setAction("print")}>
          Print
        </ToolbarButton>
      </Toolbar>
      <output data-slot="output">Last: {action}</output>
    </div>
  )
}

export { Example }
