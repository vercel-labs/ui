"use client"

import * as React from "react"
import { Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from "@ui-sdk/react/menu"

function Example() {
  const [action, setAction] = React.useState("")

  return (
    <div data-slot="stack">
      <Menu onAction={setAction}>
        <MenuTrigger>File</MenuTrigger>
        <MenuContent>
          <MenuItem value="new-tab" shortcut="mod+t">
            New tab
          </MenuItem>
          <MenuItem value="new-window" shortcut="mod+n">
            New window
          </MenuItem>
          <MenuItem value="open" shortcut="mod+o">
            Open…
          </MenuItem>
          <MenuSeparator />
          <MenuItem value="save" shortcut="mod+s">
            Save
          </MenuItem>
          <MenuItem value="save-as" shortcut="mod+shift+s">
            Save as…
          </MenuItem>
          <MenuSeparator />
          <MenuItem value="print" shortcut="mod+p">
            Print…
          </MenuItem>
        </MenuContent>
      </Menu>
      <output data-slot="output">{action ? `Ran ${action}` : "Pick an item"}</output>
    </div>
  )
}

export { Example }
