"use client"

import * as React from "react"
import { Menu, MenuContent, MenuContextTrigger, MenuItem, MenuSeparator } from "@ui-sdk/react/menu"

function Example() {
  const [action, setAction] = React.useState("")

  return (
    <div data-slot="stack">
      <Menu onAction={setAction}>
        <MenuContextTrigger tabIndex={0}>Right-click or long-press here</MenuContextTrigger>
        <MenuContent>
          <MenuItem value="back">Back</MenuItem>
          <MenuItem value="forward" disabled>
            Forward
          </MenuItem>
          <MenuItem value="reload">Reload</MenuItem>
          <MenuSeparator />
          <MenuItem value="save">Save page as…</MenuItem>
          <MenuItem value="print">Print…</MenuItem>
        </MenuContent>
      </Menu>
      <output data-slot="output">{action ? `Last action: ${action}` : "No action yet"}</output>
    </div>
  )
}

export { Example }
