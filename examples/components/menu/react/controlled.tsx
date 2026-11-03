"use client"

import * as React from "react"
import { createMenuController, Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/react/menu"

function Example() {
  const [menu] = React.useState(() => createMenuController())
  const [open, setOpen] = React.useState(false)
  const [reason, setReason] = React.useState("")

  return (
    <div data-slot="stack">
      <div data-slot="row">
        <Menu
          open={open}
          onOpenChange={(next, details) => {
            setOpen(next)
            setReason(details.reason)
          }}
          controller={menu}
        >
          <MenuTrigger>Actions</MenuTrigger>
          <MenuContent>
            <MenuItem value="rename">Rename</MenuItem>
            <MenuItem value="duplicate">Duplicate</MenuItem>
            <MenuItem value="archive">Archive</MenuItem>
          </MenuContent>
        </Menu>
        <button data-variant="ghost" onClick={() => setOpen(true)}>
          Open with state
        </button>
        <button data-variant="ghost" onClick={() => menu.open({ focus: "first" })}>
          Open with the controller
        </button>
      </div>

      <output data-slot="output">
        {open ? "Open" : "Closed"}
        {reason && `, last change: ${reason}`}
      </output>
    </div>
  )
}

export { Example }
