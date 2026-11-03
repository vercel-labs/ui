"use client"

import * as React from "react"
import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@ui-sdk/react/menu"

function Example() {
  const [action, setAction] = React.useState("")

  return (
    <div data-slot="stack">
      <Menu onAction={setAction}>
        <MenuTrigger>Project</MenuTrigger>
        <MenuContent>
          <MenuGroup>
            <MenuGroupLabel>Project</MenuGroupLabel>
            <MenuItem value="overview">Overview</MenuItem>
            <MenuItem value="members">Members</MenuItem>
            <MenuItem value="settings">Settings</MenuItem>
          </MenuGroup>
          <MenuSeparator />
          <MenuGroup>
            <MenuGroupLabel>Help</MenuGroupLabel>
            <MenuItem value="docs">Documentation</MenuItem>
            <MenuItem value="feedback">Send feedback</MenuItem>
          </MenuGroup>
        </MenuContent>
      </Menu>
      <output data-slot="output">{action ? `Ran ${action}` : "Pick an item"}</output>
    </div>
  )
}

export { Example }
